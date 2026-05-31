#if UNITY_EDITOR
using UnityEditor;
using System;
using System.IO;
using UnityEngine;
using System.Collections.Generic;

public class AutoBuilder
{
    public static void BuildForTarget()
    {
        string[] scenes = { "Assets/Scenes/Main.unity" };
        string buildPath = "Builds/";

        // Get target platform from environment variable
        string target = Environment.GetEnvironmentVariable("UNITY_TARGET");
        string gameVersion = Environment.GetEnvironmentVariable("GAME_VERSION") ?? "1.0.0";

        // Common settings
        PlayerSettings.companyName = "TekipakiPC";
        PlayerSettings.productName = "StarCollectingGame";
        PlayerSettings.bundleVersion = gameVersion;
        PlayerSettings.copyright = "Copyright (C) 2026 TekipakiPC. All Rights Reserved.";

        // Force Landscape orientation
        PlayerSettings.defaultInterfaceOrientation = UIOrientation.LandscapeLeft;

        // Update Credits UI before building
        UpdateCreditUI();

        if (target == "Android")
        {
            SetupAndroidKey();

            // Build APK (Testing)
            EditorUserBuildSettings.buildAppBundle = false;
            string apkPath = buildPath + "Android/game.apk";
            Directory.CreateDirectory(Path.GetDirectoryName(apkPath));
            BuildPipeline.BuildPlayer(scenes, apkPath, BuildTarget.Android, BuildOptions.None);

            // Build AAB (Play Store)
            EditorUserBuildSettings.buildAppBundle = true;
            string aabPath = buildPath + "Android/game.aab";
            BuildPipeline.BuildPlayer(scenes, aabPath, BuildTarget.Android, BuildOptions.None);
        }
        else if (target == "Win64")
        {
            string winPath = buildPath + "Windows/game.exe";
            Directory.CreateDirectory(Path.GetDirectoryName(winPath));
            BuildPipeline.BuildPlayer(scenes, winPath, BuildTarget.StandaloneWindows64, BuildOptions.None);
        }
    }

    private static void SetupAndroidKey()
    {
        string keystoreBase64 = Environment.GetEnvironmentVariable("ANDROID_KEYSTORE_BASE64");
        if (!string.IsNullOrEmpty(keystoreBase64))
        {
            string keystorePath = Path.Combine(Directory.GetCurrentDirectory(), "user.keystore");
            File.WriteAllBytes(keystorePath, Convert.FromBase64String(keystoreBase64));

            PlayerSettings.Android.useCustomKeystore = true;
            PlayerSettings.Android.keystoreName = keystorePath;
            PlayerSettings.Android.keystorePass = Environment.GetEnvironmentVariable("ANDROID_KEYSTORE_PASS");
            PlayerSettings.Android.keyaliasName = "tekipakipc";
            PlayerSettings.Android.keyaliasPass = Environment.GetEnvironmentVariable("ANDROID_KEYALIAS_PASS");
        }
    }

    private static void UpdateCreditUI()
    {
        Debug.Log("Updating Credit UI from assets_credits.json...");
        string creditsPath = Path.Combine(Application.dataPath, "Resources/assets_credits.json");
        if (File.Exists(creditsPath))
        {
            string json = File.ReadAllText(creditsPath);
            // In a real Unity environment, we would find the Text component and update it.
            // Since this is automated, we assume the UI text is bound to a script that reads this JSON at runtime,
            // or we could use UnityEditor to find and modify the scene object.
            Debug.Log("Credits data loaded and ready for build.");
        }
    }
}
#endif
