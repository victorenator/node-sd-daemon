{
    "targets": [
        {
            "target_name": "daemon",
            "sources": [ "src/daemon.cc" ],
            "libraries": [
                "<!@(pkg-config --libs-only-l libsystemd-daemon)"
            ]
        }
    ]
}
