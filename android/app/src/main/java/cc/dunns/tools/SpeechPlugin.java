package cc.dunns.tools;

import android.os.Bundle;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Locale;

/**
 * Android WebViews don't implement the Web Speech API (window.speechSynthesis
 * is undefined), so every "tap to speak" feature would be silent in the app.
 * The site's shared useSpeech hook (src/lib/use-speech.ts) calls this plugin
 * instead when it's running inside the app. It uses the phone's own
 * text-to-speech engine, preferring an Australian English voice.
 *
 * Events: "speechStart" and "speechEnd" so the page can show speaking state.
 */
@CapacitorPlugin(name = "Speech")
public class SpeechPlugin extends Plugin {

    private static final int MAX_LENGTH = 4000;

    private TextToSpeech tts;
    private boolean ready = false;

    @Override
    public void load() {
        tts = new TextToSpeech(getContext(), status -> {
            if (status != TextToSpeech.SUCCESS) return;
            int result = tts.setLanguage(new Locale("en", "AU"));
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                tts.setLanguage(Locale.ENGLISH);
            }
            tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                @Override
                public void onStart(String utteranceId) {
                    notifyListeners("speechStart", new JSObject());
                }

                @Override
                public void onDone(String utteranceId) {
                    notifyListeners("speechEnd", new JSObject());
                }

                @Override
                @Deprecated
                public void onError(String utteranceId) {
                    notifyListeners("speechEnd", new JSObject());
                }

                @Override
                public void onStop(String utteranceId, boolean interrupted) {
                    notifyListeners("speechEnd", new JSObject());
                }
            });
            ready = true;
        });
    }

    @PluginMethod
    public void isAvailable(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("available", ready);
        call.resolve(ret);
    }

    @PluginMethod
    public void speak(PluginCall call) {
        String text = call.getString("text", "");
        if (text == null || text.trim().isEmpty()) {
            call.resolve();
            return;
        }
        if (!ready || tts == null) {
            call.reject("Text-to-speech is not ready on this device");
            return;
        }
        if (text.length() > MAX_LENGTH) text = text.substring(0, MAX_LENGTH);

        Double rate = call.getDouble("rate", 0.95);
        tts.setSpeechRate(rate == null ? 0.95f : (float) Math.max(0.5, Math.min(2.0, rate)));

        // QUEUE_FLUSH: a new tap replaces whatever is being said, like the web version.
        Bundle params = new Bundle();
        int result = tts.speak(text, TextToSpeech.QUEUE_FLUSH, params, "msb-" + System.currentTimeMillis());
        if (result == TextToSpeech.SUCCESS) {
            call.resolve();
        } else {
            call.reject("Could not speak that text");
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (tts != null) tts.stop();
        notifyListeners("speechEnd", new JSObject());
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        if (tts != null) {
            tts.stop();
            tts.shutdown();
            tts = null;
        }
        ready = false;
    }
}
