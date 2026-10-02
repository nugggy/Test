package cc.dunns.tools;

import android.content.Context;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.webkit.WebView;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Android WebViews do not implement window.print(), so the website's shared
 * PrintButton calls this plugin when it detects it is running inside the app.
 * It hands the current page to the system print dialog, which lets the user
 * print or save as PDF with the site's @media print styles applied.
 */
@CapacitorPlugin(name = "Printer")
public class PrinterPlugin extends Plugin {

    @PluginMethod
    public void print(PluginCall call) {
        String rawName = call.getString("name", "Toolkit");
        // Keep the job name short and plain: it shows in the system print UI.
        final String jobName = rawName == null || rawName.trim().isEmpty()
            ? "Toolkit"
            : rawName.replaceAll("[\r\n\t]", " ").trim().substring(0, Math.min(80, rawName.trim().length()));

        getActivity().runOnUiThread(() -> {
            try {
                WebView webView = getBridge().getWebView();
                PrintManager printManager = (PrintManager) getContext().getSystemService(Context.PRINT_SERVICE);
                if (printManager == null) {
                    call.reject("Printing is not available on this device");
                    return;
                }
                PrintDocumentAdapter adapter = webView.createPrintDocumentAdapter(jobName);
                PrintAttributes attributes = new PrintAttributes.Builder()
                    .setMediaSize(PrintAttributes.MediaSize.ISO_A4)
                    .build();
                printManager.print(jobName, adapter, attributes);
                call.resolve();
            } catch (Exception e) {
                // Generic message only: never echo exception details to the page.
                call.reject("Could not open the print dialog");
            }
        });
    }
}
