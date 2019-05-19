{
    "targets": [
        {
            "target_name": "daemon",
            "defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
            "sources": [ "src/daemon.cc" ],
            "libraries": [
                "<!@(sh -c 'pkg-config --silence-errors --libs-only-l libsystemd || pkg-config --silence-errors --libs-only-l libsystemd-daemon')"
            ]
        },
        {
            "target_name": "install_daemon_node",
            "dependencies": ["daemon"],
            "actions": [
                {
                    "action_name": "install_daemon_node",
                    "inputs": [
                        "<@(PRODUCT_DIR)/daemon.node"
                    ],
                    "outputs": [
                        "daemon.node"
                    ],
                    "action": ["cp", "<@(PRODUCT_DIR)/daemon.node", "daemon.node"]
                }
            ]
        }
    ]
}
