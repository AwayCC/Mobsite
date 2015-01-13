package com.mobsite;

import android.animation.LayoutTransition;
import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Point;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.Bundle;
import android.os.Vibrator;
import android.provider.MediaStore;
import android.util.Log;
import android.view.DragEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.widget.AbsoluteLayout;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.Toast;
import android.widget.VideoView;
import org.apache.cordova.Config;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.api.CordovaInterface;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

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

    protected CordovaWebView cwv = null;
    protected FrameLayout mainll, shadowP;
    protected String selectedHTML;
    protected CordovaWebView shadow;
    protected VideoView splashVid;
    protected RelativeLayout splashView;
    protected Vibrator vibrator;
    private boolean splash = true;

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

        // Get project name from intent.
        if (getIntent().getExtras() != null){
            projectName = getIntent().getExtras().getString("projectName");
            projectPath = getFilesDir() +File.separator+ getResources().getString(R.string.user_projects_path) +File.separator+ projectName;
        }
        Log.v(_logTag, projectName);

        Log.v(_logTag, "onCreate(): find views & preparation.");
        splashVid = (VideoView) findViewById(R.id.splash_vid);
        splashView = (RelativeLayout) findViewById(R.id.splash_view);
        splashVid.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
            @Override
            public void onCompletion(MediaPlayer mediaPlayer) {
                if (splash) {
                    splashVid.seekTo(0);
                    splashVid.start();
                } else {
                    splashView.setVisibility(View.GONE);
                }
            }
        });
        splashVid.setVideoURI(Uri.parse("android.resource://" + getPackageName() + "/" + R.raw.splash));
        splashVid.start();

        shadow = (CordovaWebView) findViewById(R.id.shadow);

        vibrator = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
        mainll = (FrameLayout) findViewById(R.id.mainLL);
        LayoutTransition splashTrans = new LayoutTransition();
        splashTrans.enableTransitionType(LayoutTransition.DISAPPEARING);
        mainll.setLayoutTransition(splashTrans);

        shadowP = (FrameLayout) findViewById(R.id.shadow_parent);
        shadowP.setAlpha(0);

        cwv = (CordovaWebView) findViewById(R.id.main_webview);
        Config.init(this);
        cwv.loadUrl(Config.getStartUrl());
        cwv.addJavascriptInterface(this, "Android");
        setCordovaWebViewGestures(cwv);
    }

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

        // the following code is for using camera.
        if (resultCode == RESULT_OK) {
            switch (requestCode) {
                case REQUEST_GALLERY:
                    Log.v(_logTag, "gallery");
                    if (intent != null) {
                        newPhoto = intent.getData();
                    }
                    break;
                case REQUEST_CAMERA:
                    Log.v(_logTag, "camera");
                    try {
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
                        /*String mLine = reader.readLine();
                        while (mLine != null) {
                            fout.write(mLine.getBytes("utf-8"));
                            mLine = reader.readLine();
                        }
                        */
                        int c;
                        while ((c = in.read()) != -1){
                            fout.write(c);
                        }
                        fout.flush();
                        //byte[] buffer = new byte[5 * 1024];
                        //while (in.read(buffer) > -1)
                        //    fout.write(buffer);
                        fout.close();
                    } catch (FileNotFoundException fne) {
                        Log.e(_logTag, "no file.");
                        fne.printStackTrace();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }

                    break;
            }
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
    /*
    * The following function is called in onCreate() to set up gestures of CordovaWebView.
    */
    private void setCordovaWebViewGestures(final CordovaWebView cordovaWV) {
        /*
        * @params CordovaWebView cwv : The embedded CordovaWebView of the activity.
        * @return void               : No return needed.
        *
        * The following codes are for setting drag listeners.
        * "drag start", "drag end" callback functions are executed here.
        */
        cordovaWV.setOnTouchListener(new View.OnTouchListener() {

            public boolean onTouch(View v, MotionEvent event) {
                final int action = event.getAction();
                switch(action){
                    case MotionEvent.ACTION_DOWN:

                        break;
                    case MotionEvent.ACTION_MOVE:
                        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(cwv.getWidth()*2/3,
                                                                                   FrameLayout.LayoutParams.WRAP_CONTENT);
                        lp.setMargins((int)event.getRawX(), (int)event.getRawY(), 0, 0);
                        shadow.setLayoutParams(lp);
                        break;
                }
                //Log.v("spy on touch events", event.toString());
                return false;
            }
        });


        cordovaWV.setOnDragListener(new View.OnDragListener() {
            @Override
            public boolean onDrag(View view, DragEvent dragEvent) {
                Log.v("spy on drag events", dragEvent.toString());
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
    public void showDialog(String msg) {
        Log.v("JSinterface", msg);
        new AlertDialog.Builder(this)
                .setTitle("html code")
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
    public void hideSplashView() { splash = false; }

    @JavascriptInterface
    public String getProjectPath() { return projectPath; }

    @JavascriptInterface
    public void setSelectedHTML(String s) {
        selectedHTML = s;
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                //shadow.setVisibility(View.INVISIBLE);
                //mainll.removeView(shadow);
                shadowP.removeView(shadow);
                shadow = new CordovaWebView(MainActivity.this);

                shadow.setLayoutParams(new ViewGroup.LayoutParams(cwv.getWidth()*2/3,
                        ViewGroup.LayoutParams.WRAP_CONTENT));

                //mainll.addView(shadow);
                shadowP.addView(shadow);
                shadowP.setAlpha(0);
                shadowP.invalidate();


                String prefix = "<link rel=\"stylesheet\" href=\"android_asset/css/bootstrap.min.css\">\n" +
                        "<script src=\"android_asset/js/jquery-1.11.1.min.js\"></script>\n" +
                        "<script src=\"android_asset/js/bootstrap.min.js\"></script>\n";
                selectedHTML = prefix + selectedHTML;
                shadow.loadData(selectedHTML, "text/html", "utf-8");
            }
        });
    }

    @JavascriptInterface
    public void startDrag() {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                if (shadow == null) {
                    vibrator.vibrate(100);
                    return;
                }


                FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(cwv.getWidth()*2/3,
                        FrameLayout.LayoutParams.WRAP_CONTENT);
                lp.setMargins(50,100,0,0);
                shadow.setLayoutParams(lp);
                shadowP.setAlpha(1f);
                shadowP.invalidate();
                //shadow.setVisibility(View.VISIBLE);
                // Drag starts.
                vibrator.vibrate(100);
            }
        });
    }

    @JavascriptInterface
    public void openPhotoDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("My Title");
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

                        cameraHolder = new File(getCacheDir(), "mobsite");
                        if (!cameraHolder.exists())
                            cameraHolder.mkdirs();

                        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyyMMdd'T'HHmmss");
                        String timestamp = dateFormat.format(new Date());
                        String imageFilename = "picture" + timestamp + ".jpg";

                        File photo = new File(cameraHolder, imageFilename);
                        try {
                            if (!photo.exists())
                                photo.createNewFile();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }

                        //Log.v(_logTag, (photo.isFile())?photo.getPath():"nope");
                        newPhoto = Uri.fromFile(photo);
                        getCamera.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(photo));
                        startActivityForResult(getCamera, REQUEST_CAMERA);
                        break;
                }
            }
        });
        builder.show();
    }

    @JavascriptInterface
    public String getProjectsPathAndContentJSON() {
        JSONArray projects = new JSONArray();
        File projectStorage = new File(projectPath);
        Log.v("project Storage", projectStorage.getPath());
        ArrayDeque<File> paths = new ArrayDeque<File>();
        paths.addLast(projectStorage);

        while(!paths.isEmpty()) {
            JSONObject project = new JSONObject();
            File f = paths.getFirst();
            //Log.v("file", f.getPath());
            if(f.isDirectory()) {
                File[] files = f.listFiles();
                for (File file : files)
                    paths.addLast(file);

            } else {
                try{
                    FileInputStream fin = new FileInputStream(f);
                    byte[] buffer = new byte[(int)f.length()];
                    fin.read(buffer);

                    String content = new String(buffer, "utf-8");
                    Log.v("path", f.getPath());
                    //Log.v("content", content);

                    String fileName = f.getPath().substring(projectPath.length()+1);
                    project.put("content", content);
                    project.put("path", fileName);
                    projects.put(project);
                }
                catch (JSONException jsonE){ jsonE.printStackTrace();}
                catch (IOException e) { e.printStackTrace(); }
            }

            paths.removeFirst();
        }
        return projects.toString();
    }

    @JavascriptInterface
    public void saveProject() {

    }
}
