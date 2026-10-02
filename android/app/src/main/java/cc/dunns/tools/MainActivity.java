package cc.dunns.tools;

import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import androidx.activity.OnBackPressedCallback;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    /**
     * Marker appended to the WebView user agent so the website can tell it is
     * running inside this app and which APK version is installed. The update
     * checker on the site (src/lib/app-update.ts) parses this exact token, so
     * keep the format "ToolkitAndroid/<versionName>".
     */
    public static final String USER_AGENT_TOKEN = "ToolkitAndroid/" + BuildConfig.VERSION_NAME;

    /** The site the app loads; must match server.url in capacitor.config.ts. */
    private static final String HOME_URL = "https://tools.dunns.cc/";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PrinterPlugin.class);
        registerPlugin(SpeechPlugin.class);
        super.onCreate(savedInstanceState);

        WebSettings settings = getBridge().getWebView().getSettings();
        String ua = settings.getUserAgentString();
        if (ua == null || !ua.contains(USER_AGENT_TOKEN)) {
            settings.setUserAgentString((ua == null ? "" : ua + " ") + USER_AGENT_TOKEN);
        }

        // Android back button / gesture. Without this, Capacitor falls through
        // to the default Activity behaviour and closes the app on the first
        // press. Instead:
        //   1. on the homepage, back leaves the app, as users expect;
        //   2. otherwise, if there is page history, go back one step;
        //   3. otherwise (e.g. opened straight onto a tool), go to the homepage.
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                WebView webView = getBridge().getWebView();
                if (isHome(webView.getUrl())) {
                    // Hand back to the system, which closes the app.
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                    setEnabled(true);
                    return;
                }
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    webView.loadUrl(HOME_URL);
                }
            }
        });
    }

    private static boolean isHome(String url) {
        if (url == null) return true;
        Uri uri = Uri.parse(url);
        String path = uri.getPath();
        return path == null || path.isEmpty() || path.equals("/");
    }
}
