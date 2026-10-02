package cc.dunns.tools;

import android.os.Bundle;
import android.webkit.WebSettings;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    /**
     * Marker appended to the WebView user agent so the website can tell it is
     * running inside this app and which APK version is installed. The update
     * checker on the site (src/lib/app-update.ts) parses this exact token, so
     * keep the format "ToolkitAndroid/<versionName>".
     */
    public static final String USER_AGENT_TOKEN = "ToolkitAndroid/" + BuildConfig.VERSION_NAME;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PrinterPlugin.class);
        super.onCreate(savedInstanceState);

        WebSettings settings = getBridge().getWebView().getSettings();
        String ua = settings.getUserAgentString();
        if (ua == null || !ua.contains(USER_AGENT_TOKEN)) {
            settings.setUserAgentString((ua == null ? "" : ua + " ") + USER_AGENT_TOKEN);
        }
    }
}
