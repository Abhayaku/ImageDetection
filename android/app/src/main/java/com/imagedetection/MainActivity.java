package com.imagedetection;

import com.facebook.react.ReactActivity;
import android.view.WindowManager;
import android.os.Build;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) 
  {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) 
    {
      WindowManager.LayoutParams layoutParams = new WindowManager.LayoutParams();
      layoutParams.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
      getWindow().setAttributes(layoutParams);
    }
      super.onCreate(savedInstanceState);
  }
  @Override
  protected String getMainComponentName() {
    return "ImageDetection";
  }
}
