package com.mobsite;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.Point;
import android.os.Bundle;
import android.util.Log;
import android.view.Display;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.AlphaAnimation;
import android.view.animation.Animation;
import android.view.animation.TranslateAnimation;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.SimpleAdapter;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
    SimpleAdapter OpenAdapter, NewAdapter;
    ;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.start_activity);
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

        OpenAdapter = new SimpleAdapter(this, planetsList, R.layout.listtext, new String[]{"Open"}, new int[]{android.R.id.text1});
        NewAdapter = new SimpleAdapter(this, planetsList, R.layout.listtext, new String[]{"New"}, new int[]{android.R.id.text1});
        openmenu.setAdapter(OpenAdapter);
        openmenu.setSelected(true);
        newmenu.setAdapter(NewAdapter);
        newmenu.setSelected(true);
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
        planetsList.add(createPlanet("Open", "Mercury"));
        planetsList.add(createPlanet("Open", "Venus"));
        planetsList.add(createPlanet("Open", "Mars"));
        planetsList.add(createPlanet("Open", "Jupiter"));
        planetsList.add(createPlanet("New", "Saturn"));
        planetsList.add(createPlanet("New", "Uranus"));
        planetsList.add(createPlanet("New", "Neptune"));
        planetsList.add(createPlanet("New", "GG"));

    }

    private HashMap<String, String> createPlanet(String key, String name) {
        HashMap<String, String> planet = new HashMap<String, String>();
        planet.put(key, name);
        return planet;
    }

    class Choose_Listener implements AdapterView.OnItemClickListener {
        @Override
        public void onItemClick(AdapterView<?> adapterView, View view, int i, long l) {
            if (view == selected) {
                Toast.makeText(getApplicationContext(), adapterView.getItemAtPosition(i).toString(), Toast.LENGTH_LONG).show();
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

            getProjectNames();
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

    private boolean newProject(String name) {
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

            // html files.
            copyInitFile("init/index.html", new File(newProject, "index.html"));

            // css files.
            File css = new File(newProject, "css");
            css.mkdirs();
            copyInitFile("init/css/bootstrap.css", new File(css, "bootstrap.css"));
            // see if there is more files...

        }
        return true;
    }

    private void copyInitFile(String from, File to){
        try {
            to.createNewFile();
            InputStream in  = this.getAssets().open(from);
            FileOutputStream fout = new FileOutputStream(to);
            BufferedReader reader = new BufferedReader(
                                        new InputStreamReader(in, "UTF-8"));
            String mLine = reader.readLine();
            while (mLine != null) {
                fout.write(mLine.getBytes("utf-8"));
                mLine = reader.readLine();
            }
            fout.close();
        } catch (IOException e){ e.printStackTrace(); }
    }
}
