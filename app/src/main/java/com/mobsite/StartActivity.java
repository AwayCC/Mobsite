package com.mobsite;

import android.animation.LayoutTransition;
import android.app.Activity;
import android.app.AlertDialog;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Point;
import android.media.MediaPlayer;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.TranslateAnimation;
import android.view.inputmethod.InputMethodManager;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RelativeLayout;
import android.widget.SimpleAdapter;
import android.widget.Toast;
import android.widget.VideoView;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Queue;
import java.util.Vector;


public class StartActivity extends Activity {
    int width;
    Button testbtn;
    ImageView openbtn;
    ImageView newbtn;
    ImageView newreturn;
    ImageView opreturn;
    LinearLayout opmucon;
    LinearLayout newmucon;
    ListView openmenu;
    ListView newmenu;
    Openbtn_Listener openbtn_listener;
    Openre_Listener openre_listener;
    Newbtn_Listener newbtn_listener;
    Newre_Listener newre_listener;
    TranslateAnimation aniright;
    Choose_Listener choose_listener;
    View selected;
    private List<Map<String, String>> planetsList = new ArrayList<Map<String, String>>();
    private List<Map<String, String>> oldProjectsList = new ArrayList<Map<String, String>>();
    private List<Map<String, String>> templateList = new ArrayList<Map<String, String>>();
    SimpleAdapter OpenAdapter, NewAdapter;
    private VideoView splashVid;
    private RelativeLayout splashView;
    private boolean splash = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.start_activity);

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

        FrameLayout startFrame = (FrameLayout) findViewById(R.id.startFrame);
        LayoutTransition splashTrans = new LayoutTransition();
        splashTrans.enableTransitionType(LayoutTransition.DISAPPEARING);
        startFrame.setLayoutTransition(splashTrans);

        layoutregist();
        testbtn.setOnClickListener(new Testbtn_Listener(this));
        newbtn.setOnClickListener(newbtn_listener);
        openbtn.setOnClickListener(openbtn_listener);
        Display display = getWindowManager().getDefaultDisplay();
        Point size = new Point();
        display.getSize(size);
        width = size.x;
        int height = size.y;
        iniList();

        OpenAdapter = new SimpleAdapter(this, oldProjectsList, R.layout.listtext, new String[]{"Open"}, new int[]{android.R.id.text1});
        NewAdapter = new SimpleAdapter(this, templateList, R.layout.listtext, new String[]{"New"}, new int[]{android.R.id.text1});
        openmenu.setAdapter(OpenAdapter);
        openmenu.setSelected(true);
        newmenu.setAdapter(NewAdapter);
        newmenu.setSelected(true);
        splash = false;
    }

    private void layoutregist() {
        openbtn = (ImageView) findViewById(R.id.openbtn);
        newbtn = (ImageView) findViewById(R.id.newbtn);
        testbtn = (Button) findViewById(R.id.testbtn);
        newreturn = (ImageView) findViewById(R.id.newreturn);
        opreturn = (ImageView) findViewById(R.id.opreturn);
        openbtn_listener = new Openbtn_Listener(this);
        openre_listener = new Openre_Listener(this);
        newbtn_listener = new Newbtn_Listener(this);
        newre_listener = new Newre_Listener(this);
        opmucon = (LinearLayout) findViewById(R.id.opmucon);
        newmucon = (LinearLayout) findViewById(R.id.newmucon);
        openmenu = (ListView) findViewById(R.id.openmenu);
        newmenu = (ListView) findViewById(R.id.newmenu);
        openmenu.setOnItemClickListener(new Choose_Listener());
        newmenu.setOnItemClickListener(new Choose_Listener());
    }

    private void iniList() {
        Vector<String> projectNames = getProjectNames();
        for(String s : projectNames){
            oldProjectsList.add(addProjectName("Open", s));
        }

        templateList.add(addProjectName("New","template_1"));
        templateList.add(addProjectName("New","template_2"));
        templateList.add(addProjectName("New","template_3"));
        templateList.add(addProjectName("New","default"));
        /*
        planetsList.add(addProjectName("Open", "Mercury"));
        planetsList.add(createPlanet("Open", "Venus"));
        planetsList.add(createPlanet("Open", "Mars"));
        planetsList.add(createPlanet("Open", "Jupiter"));
        planetsList.add(createPlanet("New", "Saturn"));
        planetsList.add(createPlanet("New", "Uranus"));
        planetsList.add(createPlanet("New", "Neptune"));
        planetsList.add(createPlanet("New", "GG"));
        */
    }

    private HashMap<String, String> addProjectName(String key, String name) {
        HashMap<String, String> project = new HashMap<String, String>();
        project.put(key, name);
        return project;
    }

    /*
    private HashMap<String, String> createPlanet(String key, String name) {
        HashMap<String, String> planet = new HashMap<String, String>();
        planet.put(key, name);
        return planet;
    }*/

    class Choose_Listener implements AdapterView.OnItemClickListener {
        @Override
        public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
            if (view == selected) {
                //Toast.makeText(getApplicationContext(), adapterView.getItemAtPosition(i).toString(), Toast.LENGTH_LONG).show();

                HashMap<String, String> data = (HashMap<String, String>) adapterView.getItemAtPosition(i);

                if(data.containsKey("Open")/* && oldProjectsList.size() > 0*/){
                    // from open list.
                    String selectedProject = data.get("Open");
                    Intent edit = new Intent();
                    edit.setClass(StartActivity.this, MainActivity.class);

                    Bundle bundle = new Bundle();
                    bundle.putString("projectName", selectedProject);
                    edit.putExtras(bundle);
                    startActivity(edit);
                } else {
                    // from new list.
                    final String templateName = data.get("New");

                    LayoutInflater inflater = StartActivity.this.getLayoutInflater();
                    final View v = inflater.inflate(R.layout.new_project_dialog, null);

                    final AlertDialog dialog = new AlertDialog.Builder(StartActivity.this)
                            .setView(v)
                            .setTitle("New project name")
                            .setPositiveButton("Ok", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialogInterface, int i) {
                                    EditText editText = (EditText) v.findViewById(R.id.newProjectName);
                                    String newName = editText.getText().toString();

                                    InputMethodManager imm = (InputMethodManager) getSystemService(
                                            Context.INPUT_METHOD_SERVICE);
                                    imm.hideSoftInputFromWindow(editText.getWindowToken(),
                                            InputMethodManager.HIDE_IMPLICIT_ONLY);

                                    if (newName.equals("")) {
                                        Toast toast = Toast.makeText(StartActivity.this, "Input is empty", Toast.LENGTH_LONG);
                                        toast.setGravity(Gravity.CENTER_HORIZONTAL | Gravity.TOP, 0, 50);
                                        toast.show();
                                        return;
                                    }

                                    if (!newProjectValid(newName)) {
                                        Toast toast = Toast.makeText(StartActivity.this, "This name is already in use. Use another.", Toast.LENGTH_LONG);
                                        toast.setGravity(Gravity.CENTER_HORIZONTAL | Gravity.TOP, 0, 50);
                                        toast.show();
                                        return;
                                    }

                                    InitTask task = new InitTask();
                                    task.setProjectStrs(newName, templateName);
                                    task.execute();
                                }
                            })
                            .show();

                    //pDialog.show();
                }

                return;
            }

            for (int j = 0; j < adapterView.getChildCount(); j++) {
                adapterView.getChildAt(j).setBackgroundColor(Color.TRANSPARENT);
            }
            view.setBackgroundColor(Color.parseColor("#494949"));
            selected = view;
        }

        public View getSelected() {
            return selected;
        }
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    class Openbtn_Listener implements View.OnClickListener {
        private StartActivity activity;

        public Openbtn_Listener(StartActivity activity) {
            this.activity = activity;
        }

        @Override
        public void onClick(View view) {
            newbtn.setOnClickListener(null);
            openbtn.setOnClickListener(null);
            // Toast.makeText(getApplicationContext(),"Open",Toast.LENGTH_LONG).show();
            TranslateAnimation anim = new TranslateAnimation(0, width * 45 / 100, 0, 0);
            TranslateAnimation anim2 = new TranslateAnimation(0, width * 45 / 100, 0, 0);
            anim.setDuration(600);
            anim.setFillAfter(true);
            anim2.setDuration(600);
            anim2.setFillAfter(true);
            Animation alpha = new AlphaAnimation(1.0f, 0.0f);
            alpha.setDuration(600);
            alpha.setRepeatCount(0);
            alpha.setFillAfter(false);
            alpha.setFillAfter(false);
            alpha.setFillEnabled(true);
            opreturn.setOnClickListener(new Openre_Listener(StartActivity.this));
            anim.setAnimationListener(new Animation.AnimationListener() {
                @Override
                public void onAnimationStart(Animation animation) {

                }

                @Override
                public void onAnimationEnd(Animation animation) {
                    Animation alpha = new AlphaAnimation(0.0f, 1.0f);
                    alpha.setDuration(600);
                    alpha.setRepeatCount(0);
                    alpha.setFillAfter(true);
                    opmucon.setVisibility(View.VISIBLE);
                    opreturn.setVisibility(View.VISIBLE);
                    opreturn.startAnimation(alpha);
                    opmucon.startAnimation(alpha);
                    opmucon.bringToFront();
                }

                @Override
                public void onAnimationRepeat(Animation animation) {

                }
            });
            openbtn.startAnimation(anim);
            newbtn.startAnimation(anim2);

        }
    }

    class Openre_Listener implements View.OnClickListener {
        private StartActivity activity;

        public Openre_Listener(StartActivity activity) {
            this.activity = activity;
        }

        @Override
        public void onClick(View view) {
            opreturn.setOnClickListener(null);
            //Toast.makeText(getApplicationContext(),"Openre",Toast.LENGTH_LONG).show();
            Animation alpha = new AlphaAnimation(1.0f, 0.0f);
            alpha.setDuration(600);
            alpha.setRepeatCount(0);
            alpha.setFillAfter(true);
            alpha.setAnimationListener(new Animation.AnimationListener() {
                @Override
                public void onAnimationStart(Animation animation) {

                }

                @Override
                public void onAnimationEnd(Animation animation) {
                    newbtn.setOnClickListener(newbtn_listener);
                    openbtn.setOnClickListener(openbtn_listener);
                    TranslateAnimation anim = new TranslateAnimation(width * 45 / 100, 0, 0, 0);
                    anim.setDuration(600);
                    anim.setFillAfter(true);
                    newbtn.startAnimation(anim);
                    openbtn.startAnimation(anim);
                    opmucon.setVisibility(View.INVISIBLE);
                    openbtn.bringToFront();
                    opreturn.setVisibility(View.INVISIBLE);
                }

                @Override
                public void onAnimationRepeat(Animation animation) {

                }
            });
            opmucon.startAnimation(alpha);
            opreturn.startAnimation(alpha);
        }
    }

    class Newbtn_Listener implements View.OnClickListener {
        private StartActivity activity;

        public Newbtn_Listener(StartActivity activity) {
            this.activity = activity;
        }

        @Override
        public void onClick(View view) {
            newbtn.setOnClickListener(null);
            openbtn.setOnClickListener(null);
            //Toast.makeText(getApplicationContext(),"Open",Toast.LENGTH_LONG).show();
            TranslateAnimation anim = new TranslateAnimation(0, -width * 45 / 100, 0, 0);
            TranslateAnimation anim2 = new TranslateAnimation(0, -width * 45 / 100, 0, 0);
            anim.setDuration(600);
            anim.setFillAfter(true);
            anim2.setDuration(600);
            anim2.setFillAfter(true);
            Animation alpha = new AlphaAnimation(1.0f, 0.0f);
            alpha.setDuration(600);
            alpha.setRepeatCount(0);
            alpha.setFillAfter(false);
            alpha.setFillAfter(false);
            alpha.setFillEnabled(true);
            newreturn.setOnClickListener(newre_listener);
            anim.setAnimationListener(new Animation.AnimationListener() {
                @Override
                public void onAnimationStart(Animation animation) {

                }

                @Override
                public void onAnimationEnd(Animation animation) {
                    Animation alpha = new AlphaAnimation(0.0f, 1.0f);
                    alpha.setDuration(600);
                    alpha.setRepeatCount(0);
                    alpha.setFillAfter(true);
                    newmucon.setVisibility(View.VISIBLE);
                    newreturn.setVisibility(View.VISIBLE);
                    newreturn.startAnimation(alpha);
                    newmucon.startAnimation(alpha);
                    newmucon.bringToFront();

                }

                @Override
                public void onAnimationRepeat(Animation animation) {

                }
            });
            openbtn.startAnimation(anim);
            newbtn.startAnimation(anim2);

        }
    }

    class Newre_Listener implements View.OnClickListener {
        private StartActivity activity;

        public Newre_Listener(StartActivity activity) {
            this.activity = activity;
        }

        @Override
        public void onClick(View view) {
            newreturn.setOnClickListener(null);
            //Toast.makeText(getApplicationContext(),"Openre",Toast.LENGTH_LONG).show();
            Animation alpha = new AlphaAnimation(1.0f, 0.0f);
            alpha.setDuration(600);
            alpha.setRepeatCount(0);
            alpha.setFillAfter(true);
            alpha.setAnimationListener(new Animation.AnimationListener() {
                @Override
                public void onAnimationStart(Animation animation) {

                }

                @Override
                public void onAnimationEnd(Animation animation) {
                    newbtn.setOnClickListener(newbtn_listener);
                    openbtn.setOnClickListener(openbtn_listener);
                    TranslateAnimation anim = new TranslateAnimation(-width * 45 / 100, 0, 0, 0);
                    anim.setDuration(600);
                    anim.setFillAfter(true);
                    newbtn.startAnimation(anim);
                    openbtn.startAnimation(anim);
                    newmucon.setVisibility(View.INVISIBLE);
                    newbtn.bringToFront();
                    newreturn.setVisibility(View.INVISIBLE);
                }

                @Override
                public void onAnimationRepeat(Animation animation) {

                }
            });
            newmucon.startAnimation(alpha);
            newreturn.startAnimation(alpha);
        }
    }

    class Testbtn_Listener implements View.OnClickListener {
        private StartActivity activity;

        public Testbtn_Listener(StartActivity activity) {
            this.activity = activity;
        }

        @Override
        public void onClick(View view) {

            Intent edit = new Intent();
            edit.setClass(StartActivity.this, MainActivity.class);

            // create bundle in order to pass data to object Activity.
            String name = "test1";
            Bundle bundle = new Bundle();
            //bundle.putString("projectName", "PutTheNameItHere, AwayCC!");
            //newProject(name);
            bundle.putString("projectName", name);
            edit.putExtras(bundle);

            startActivity(edit);
        }

    }

    private Vector<String> getProjectNames() {
        Vector<String> projectNames = new Vector<String>();
        File projectsStorage = new File(getFilesDir(), getResources().getString(R.string.user_projects_path));
        //Log.v("the path with all projects",projectsStorage.getPath());
        if (!projectsStorage.exists())
            projectsStorage.mkdirs();

        File[] files = projectsStorage.listFiles();
        for (File file : files) {
            if (file.isDirectory()) {
                String[] names = file.getPath().split("/");
                //Log.v("file system", names[names.length-1]);
                projectNames.add(names[names.length-1]);
            }
        }

        return projectNames;
    }

    private boolean newProjectValid(String name){
        File newProject = new File(getFilesDir() + File.separator + getResources().getString(R.string.user_projects_path), name);
        if(newProject.exists())
            return false;
        else
            return true;
    }

    private boolean newProject(String name, String template) {
        File newProject = new File(getFilesDir() + File.separator + getResources().getString(R.string.user_projects_path), name);
        Log.v("new folder", newProject.getPath());
        /*try{
            AssetManager assetManager = getAssets();
            String[] files = assetManager.list("");
            for (String s : files)
                Log.v("files", s);
        }catch (IOException e){e.printStackTrace();}
        */
        if(newProject.exists())
            return false;
        else {
            // initialize the project with files.
            newProject.mkdirs();
            String assetPath = "init/"+template;
            String[] list;
            try{
                // copy template files
                list = getAssets().list(assetPath);
                for (String subPath : list){
                    copyRecursively(assetPath+"/"+subPath, newProject);
                }

                // copy mobsite tool files
                assetPath = "tool";
                list = getAssets().list(assetPath);
                for (String subPath : list){
                    copyRecursively(assetPath+"/"+subPath, newProject);
                }
            }catch (IOException e){ e.printStackTrace(); }
        }
        return true;
    }

    private void copyRecursively(String assetPath, File toFolder){
        //Log.v("file debug", assetPath);
        String[] list;
        try{
            list = getAssets().list(assetPath);
            String fileName = assetPath.substring(assetPath.lastIndexOf("/"));
            if(list.length > 0){ // A folder
                Log.v("file debug", assetPath+" is folder...");
                File newFolder = new File(toFolder, fileName);
                Log.v("file debug", "NEW folder : "+newFolder.getPath());
                newFolder.mkdirs();
                for (String subPath : list){

                    copyRecursively(assetPath + "/" + subPath, newFolder);
                }
            }
            else{ // A file.
                Log.v("file debug", assetPath+" is file...");

                File newFile = new File(toFolder, fileName);
                newFile.createNewFile();

                Log.v("file debug", "copy from * "+assetPath+" * to * "+newFile.getPath());
                copyInitFile(assetPath, newFile);
            }
        }catch (IOException e){ e.printStackTrace(); }
    }

    private void copyInitFile(String from, File to){
        try {
            to.createNewFile();
            InputStream in  = new BufferedInputStream(this.getAssets().open(from));
            FileOutputStream fout = new FileOutputStream(to);

            int c;
            byte[] buffer = new byte[10*1024];
            while ((c = in.read(buffer)) != -1){
                //fout.write(c);
                fout.write(buffer, 0, c);
            }
            fout.flush();
            fout.close();
            Log.v("file debug", to.getPath()+" saved size "+to.length());
        } catch (IOException e){ e.printStackTrace(); }
    }

    private class InitTask extends AsyncTask<Void, Void, Void> {
        private ProgressDialog pDialog;
        private String newName, templateName;

        public void setProjectStrs(String n, String t){
            newName = n;
            templateName = t;
        }

        @Override
        protected void onPreExecute() {
            pDialog = new ProgressDialog(StartActivity.this);
            pDialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
            pDialog.setTitle("Initiating project...");
            pDialog.setCanceledOnTouchOutside(false);
            StartActivity.this.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    pDialog.show();
                }
            });
        }

        @Override
        protected Void doInBackground(Void... params) {
            newProject(newName, templateName);

            return null;
        }

        @Override
        protected void onPostExecute(Void result) {
            pDialog.dismiss();
            Intent edit = new Intent();
            edit.setClass(StartActivity.this, MainActivity.class);
            Bundle bundle = new Bundle();
            bundle.putString("projectName", newName);
            edit.putExtras(bundle);
            startActivity(edit);
        }

    }
}
