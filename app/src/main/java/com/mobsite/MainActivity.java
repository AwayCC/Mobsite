package com.mobsite;

import android.animation.LayoutTransition;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.ContentValues;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Point;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.provider.OpenableColumns;
import android.util.Log;
import android.view.DragEvent;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.AbsoluteLayout;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Toast;
import android.widget.VideoView;
import org.apache.cordova.Config;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.CordovaWebViewClient;
import org.apache.cordova.api.CordovaInterface;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.ArrayDeque;
import java.util.Date;
import java.util.Queue;
import java.util.Vector;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;


public class MainActivity extends Activity
        implements CordovaInterface {

    private static final String _logTag = "MainActivity";
    private static String projectName = "";
    private String projectPath;
    private ProgressDialog pDialog;
    protected Vibrator vibrator;

    protected CordovaWebView cwv = null;
    protected FrameLayout shadowP;
    protected String selectedHTML;
    protected CordovaWebView shadow;
    private boolean enableShadow = false,
            selectedShadow = false;

    // Variables for importing photos.
    private static final int REQUEST_GALLERY = 11;
    private static final int REQUEST_CAMERA = 13;
    private Uri newPhoto;
    private int imgCount = 1;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        Log.v(_logTag, "onCreate(): starts.");
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.main_activity);

        // show progress dilaog.
        pDialog = new ProgressDialog(MainActivity.this);
        pDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        pDialog.setTitle("Opening project...");
        pDialog.setCanceledOnTouchOutside(false);
        pDialog.show();

        //if(savedInstanceState == null){
        // Get project name from intent.
        if (getIntent().getExtras() != null){
            projectName = getIntent().getExtras().getString("projectName");
            projectPath = getFilesDir() +File.separator+ getResources().getString(R.string.user_projects_path) +File.separator+ projectName;
        }
        Log.v(_logTag, projectName);
        //} else {

        //}

        setViews();
    }

    // set the life cycle of the app.
    @Override
    protected void onStop() {
        super.onStop();
        Log.v(_logTag, "onStop & saveProject()");
        saveProject();
    }

        cwv = (CordovaWebView) findViewById(R.id.main_webview);
        Config.init(this);
        //cwv.loadUrl(Config.getStartUrl());
        //cwv.loadUrl("file:///android_asset/project/tool.html");
        //cwv.loadUrl("file://"+projectPath+"/tool.html");
        cwv.addJavascriptInterface(this, "Android");
        setCordovaWebViewGestures(cwv);
    @Override
    public void onSaveInstanceState(Bundle savedInstanceState) {
        super.onSaveInstanceState(savedInstanceState);

        savedInstanceState.putString("projectName", projectName);
        savedInstanceState.putString("projectPath", projectPath);
        savedInstanceState.putString("selectedHTML", selectedHTML);
        savedInstanceState.putInt("imgCount", imgCount);
    }

    /*
    @Override
    public void onRestoreInstanceState(Bundle savedInstanceState) {
        super.onRestoreInstanceState(savedInstanceState);

        projectName = savedInstanceState.getString("projectName");
        projectPath = savedInstanceState.getString("projectPath");
        selectedHTML = savedInstanceState.getString("selectedHTML");
        imgCount = savedInstanceState.getInt("imgCount");
    }*/

    /*
    * The following are the function must be declared since MainActivity
    * implements CordovaInterface.
    */

    // Plugin to call when activity result is received
    protected CordovaPlugin activityResultCallback = null;
    protected boolean activityResultKeepRunning;

    // Keep app running when pause is received. (default = true)
    // If true, then the JavaScript and native code continue to run in the background
    // when another application (activity) is started.
    protected boolean keepRunning = true;

    private final ExecutorService threadPool = Executors.newCachedThreadPool();

    public Object onMessage(String id, Object data) {
        return null;
    }

    public void onDestroy() {
        super.onDestroy();
        if (cwv.pluginManager != null) {
            cwv.pluginManager.onDestroy();
        }
        cwv.handleDestroy();
    }

    @Override
    public ExecutorService getThreadPool() {
        return threadPool;
    }

    @Override
    public void setActivityResultCallback(CordovaPlugin plugin) {
        this.activityResultCallback = plugin;
    }

    public void startActivityForResult(CordovaPlugin command, Intent intent, int requestCode) {
        this.activityResultCallback = command;
        this.activityResultKeepRunning = this.keepRunning;

        // If multitasking turned on, then disable it for activities that return results
        if (command != null) {
            this.keepRunning = false;
        }

        // Start activity
        super.startActivityForResult(intent, requestCode);
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent intent) {
        super.onActivityResult(requestCode, resultCode, intent);

        // the following code is for importing photo to the project.
        if (resultCode == RESULT_OK) {
            switch (requestCode) {
                case REQUEST_GALLERY:
                    Log.v("import photo", "gallery");
                    if (intent != null) {
                        Log.v("import photo", "intent NOT NULL!");
                        newPhoto = intent.getData();
                    }
                    break;
                case REQUEST_CAMERA:
                    Log.v("import photo", "camera");
                    break;
            }

            try{
                File internalStorage = new File(projectPath, "img");
                if (!internalStorage.exists())
                    internalStorage.mkdirs();

                File savedImage = new File(internalStorage, "img" + imgCount + ".jpg");
                while (savedImage.exists()){
                    imgCount++;
                    savedImage = new File(internalStorage, "img" + imgCount + ".jpg");
                }
                Log.v("pix", savedImage.getPath());
                savedImage.createNewFile();

                OutputStream fout = new BufferedOutputStream(new FileOutputStream(savedImage));
                InputStream in = new BufferedInputStream(getContentResolver().openInputStream(newPhoto));

                int c;
                byte[] buffer = new byte[10*1024];
                while ((c = in.read(buffer)) != -1){
                    fout.write(buffer, 0, c);
                }
                fout.flush();
                fout.close();

                Log.v("FIle size", "File is this big : "+savedImage.length());
            } catch (IOException e){ e.printStackTrace(); }
        }// end

        CordovaPlugin callback = this.activityResultCallback;
        if (callback != null) {
            callback.onActivityResult(requestCode, resultCode, intent);
        }
    }

    @Override
    public Activity getActivity() {
        return this;
    }


    /*
    * The following are the member functions of MainActivity.
    */
    private void setViews(){
        Log.v(_logTag, "onCreate(): find views & preparation.");
        shadow = (CordovaWebView) findViewById(R.id.shadow);
        shadow.setVisibility(View.INVISIBLE);
        shadowP = (FrameLayout) findViewById(R.id.shadow_parent);

        vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);

        cwv = (CordovaWebView) findViewById(R.id.main_webview);
        Config.init(this);
        cwv.loadUrl("file://"+projectPath+"/tool.html");
        cwv.addJavascriptInterface(this, "Android");
        setCordovaWebViewGestures();
    }

    private void setCordovaWebViewGestures() {
        cwv.setOnTouchListener(new View.OnTouchListener() {
            public boolean onTouch(View v, MotionEvent event) {
                final int action = event.getAction();
                switch(action){
                    case MotionEvent.ACTION_DOWN:
                        break;
                    case MotionEvent.ACTION_MOVE:
                        if(enableShadow){
                            shadow.setVisibility(View.VISIBLE);
                            FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(cwv.getWidth()*2/3,
                                    FrameLayout.LayoutParams.WRAP_CONTENT);
                            lp.setMargins((int)event.getRawX()-shadow.getWidth()/2,
                                    (int)event.getRawY()-shadow.getContentHeight()/3,
                                    0, 0);
                            shadow.setLayoutParams(lp);
                        }
                        break;
                    case MotionEvent.ACTION_UP:
                        enableShadow = false;
                        shadow.setVisibility(View.INVISIBLE);
                }

                return false;
            }
        });

        cwv.setOnDragListener(new View.OnDragListener() {
            @Override
            public boolean onDrag(View view, DragEvent dragEvent) {
                return false;
            }
        });

    }


    /**
     * JavascriptInterface functions
     */
    @JavascriptInterface
    public void showToast(String msg) { Toast.makeText(this, msg, Toast.LENGTH_SHORT).show(); }

    @JavascriptInterface
    public void showDialog(String title, String msg) {
        Log.v("JSinterface", msg);
        new AlertDialog.Builder(this)
                .setTitle(title)
                .setMessage(msg)
                .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        //do nothing !
                    }
                })
                .show();
    }

    @JavascriptInterface
    public void hideSplashView() { pDialog.dismiss(); }

    @JavascriptInterface
    public String getProjectPath() { return projectPath; }

    @JavascriptInterface
    public String getProjectName() { return projectName; }

    @JavascriptInterface
    public void setSelectedHTML(String s) {
        selectedHTML = s;
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                shadowP.removeView(shadow);
                shadow = new CordovaWebView(MainActivity.this);

                shadow.setLayoutParams(new ViewGroup.LayoutParams(cwv.getWidth()*2/3,
                        ViewGroup.LayoutParams.WRAP_CONTENT));

                shadowP.addView(shadow);
                shadowP.setAlpha(0);
                shadowP.invalidate();


                String prefix = "<link rel=\"stylesheet\" href=\"android_asset/css/bootstrap.min.css\">\n" +
                        "<script src=\"android_asset/js/jquery-1.11.1.min.js\"></script>\n" +
                        "<script src=\"android_asset/js/bootstrap.min.js\"></script>\n";
                selectedHTML = prefix + selectedHTML;
                shadow.loadData(selectedHTML, "text/html", "utf-8");
                selectedShadow = true;
            }
        });
    }

    @JavascriptInterface
    public void deselect() { selectedShadow = false; }

    @JavascriptInterface
    public void startDrag() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(cwv.getWidth()*2/3,
                        FrameLayout.LayoutParams.WRAP_CONTENT);
                lp.setMargins(50,100,0,0);
                shadow.setLayoutParams(lp);
                shadowP.setAlpha(1f);
                shadowP.invalidate();
                //shadow.setVisibility(View.VISIBLE);
                // Drag starts.
                vibrator.vibrate(100);
                enableShadow = (selectedShadow)?true:false;
            }
        });
    }

    @JavascriptInterface
    public void openTextInputDialog() {
        LayoutInflater inflater = getLayoutInflater();
        final View v = inflater.inflate(R.layout.multiline_text_input_dialog, null);
        final AlertDialog dialog = new AlertDialog.Builder(this)
                .setView(v)
                .setTitle("Input Content")
                .setPositiveButton("Ok", null)
                .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialogInterface, int i) {
                        // do nothing !
                    }
                })
                .create();

        String output = "";

        dialog.setOnShowListener(new DialogInterface.OnShowListener() {
            @Override
            public void onShow(DialogInterface dialogInterface) {
                Button b = dialog.getButton(AlertDialog.BUTTON_POSITIVE);
                b.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        Toast.makeText(MainActivity.this, "clcik", Toast.LENGTH_SHORT).show();
                        EditText input = (EditText) v.findViewById(R.id.inputText);
                        String inputHTML = input.getText().toString();
                        String output = "";
                        Log.v("before sanitize", inputHTML);
                        inputHTML = inputHTML.replace("&","&amp");
                        inputHTML = inputHTML.replace("<","&lt");
                        inputHTML = inputHTML.replace(">","&gt");
                        Log.v("after sanitize", inputHTML);
                        if(output.isEmpty()){

                        } else {
                            //dialog.dismiss();
                        }
                    }
                });
            }
        });
        dialog.show();
    }

    private File photo;

    @JavascriptInterface
    public void openPhotoDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Input Image From...");
        builder.setItems(new CharSequence[]{"Gallery", "Camera"}, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                switch (i) {
                    case 0:
                        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                        intent.setType("image/*");
                        Intent choose = Intent.createChooser(intent, "Choose a Picture From");
                        startActivityForResult(choose, REQUEST_GALLERY);
                        break;
                    case 1:
                        Intent getCamera = new Intent("android.media.action.IMAGE_CAPTURE");
                        File cameraHolder;
                        /*
                        if( Environment.getExternalStorageState().equals(Environment.MEDIA_MOUNTED) ) {
                            cameraHolder = new File(Environment.getExternalStorageDirectory(), "my_test_dir");
                        } else
                            cameraHolder = getCacheDir();
                        */

                        cameraHolder = new File(getExternalCacheDir(), "mobsite");
                        if (!cameraHolder.exists())
                            cameraHolder.mkdirs();

                        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd'T'HHmmss");
                        String timestamp = dateFormat.format(new Date());
                        String imageFilename = "picture" + timestamp + ".jpg";

                        photo = new File(cameraHolder, imageFilename);
                        try {
                            if (!photo.exists())
                                photo.createNewFile();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }

                        Log.v(_logTag, (photo.isFile())?photo.getPath():"nope");
                        newPhoto = Uri.fromFile(photo);
                        Log.v("URI", newPhoto.toString());
                        getCamera.putExtra(MediaStore.EXTRA_OUTPUT, newPhoto);
                        startActivityForResult(getCamera, REQUEST_CAMERA);
                        break;
                }
            }
        });
        builder.show();
    }

    @JavascriptInterface
    public void openBrowserDialog() {

        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                final ProgressDialog pDialog = new ProgressDialog(MainActivity.this);
                pDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
                pDialog.setTitle("connecting to Google...");


                LayoutInflater inflater = getLayoutInflater();
                View v = inflater.inflate(R.layout.link_input_dialog, null);
                final EditText input = (EditText) v.findViewById(R.id.currentURL);

                WebView browser = (WebView) v.findViewById(R.id.browser);
                //Config.init(this);
                browser.setWebViewClient(new WebViewClient() {
                    public void onPageFinished(WebView view, String url) {
                        Toast.makeText(MainActivity.this, "new page", Toast.LENGTH_SHORT).show();
                        pDialog.dismiss();
                        input.setText(view.getUrl());
                    }
                });
                browser.loadUrl("https://www.google.com");


                final AlertDialog dialog = new AlertDialog.Builder(MainActivity.this)
                        .setView(v)
                        .setTitle("Navigate To The Site")
                        .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {

                            }
                        })
                        .setNegativeButton("Cancel", new DialogInterface.OnClickListener() {
                            @Override
                            public void onClick(DialogInterface dialogInterface, int i) {
                                // do nothing !
                            }
                        })
                        .show();
                pDialog.show();
            }
        });

    }

    @JavascriptInterface
    public String getProjectsPathJSON() {
        JSONArray projects = new JSONArray();
        File projectStorage = new File(projectPath);
        Log.v("project Storage", projectStorage.getPath());
        ArrayDeque<File> paths = new ArrayDeque<File>();
        paths.addLast(projectStorage);

        while(!paths.isEmpty()) {
            JSONObject project = new JSONObject();
            File f = paths.getFirst();
            //Log.v("file", f.getPath());
            if(f.isDirectory() && f.getName().equals("tool")) {
                File[] files = f.listFiles();
                for (File file : files)
                    paths.addLast(file);

            } else {
                if(f.getName().equals("tool.html")) continue;
                try{
                    //String fileName = f.getPath().substring(projectPath.length()+1);
                    String fileName = f.getName();
                    Log.v("project Storage", fileName);
                    project.put("path", fileName);
                    projects.put(project);
                }
                catch (JSONException jsonE){ jsonE.printStackTrace();}
            }

            paths.removeFirst();
        }
        return projects.toString();
    }

    @JavascriptInterface
    public void saveProject() {
        File root = new File(projectPath);
        Log.v("peek","what's inside : ");
        for (String s : root.list()){
            Log.v("",s);
        }


    }

    @JavascriptInterface
    public void deleteProject() {
        File root = new File(projectPath);
        ArrayDeque<File> folders = new ArrayDeque<File>();
        folders.addLast(root);

        while(!folders.isEmpty()) {
            File f = folders.getFirst();
            if(f.isDirectory()){
                for (File file : f.listFiles())
                    folders.addLast(file);
            } else {
                f.delete();
            }

            folders.removeFirst();
        }
    }

    @JavascriptInterface
    public String getGalleryPaths(){
        JSONArray result = new JSONArray();
        try{
            JSONObject project = new JSONObject();
            project.put("path", "mobsite");
            result.put(project);
            project.put("path", "rocks");
            result.put(project);
            //String[] test = {"mosite", "rocks"};
        }catch (JSONException e) { e.printStackTrace(); }
        return result.toString();
    }
}
