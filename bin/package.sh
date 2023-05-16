#!/bin/sh
supported_platform_message() {
    echo "\nAvailable Supported Platform:"
    echo "- chrome \n- firefox"
}

main() {
    platform="$1"
    
    if [ -z $platform ]; then 
        echo "No parameter passed. Please input target platform as your parameter!!"
        supported_platform_message
        return 1
    fi
    
    if [ $platform = "firefox" ]; then 
        negate="chrome"
    elif [ $platform = "chrome" ]; then
        negate="firefox"
    else
        echo "Platform are Unsupported"
        supported_platform_message
        return 2
    fi

    zip -j vidio-immersive-mode.$platform.zip src/*
    zip -d vidio-immersive-mode.$platform.zip manifest.$negate.json
    printf "@ manifest.$platform.json\n@=manifest.json\n" | zipnote -w vidio-immersive-mode.$platform.zip
}

main $1