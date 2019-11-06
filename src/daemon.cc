#include <node_api.h>
#include <systemd/sd-daemon.h>

namespace daemon {

    napi_value booted(napi_env env, napi_callback_info) {
        napi_status status;
        napi_value value;

        status = napi_create_int32(env, sd_booted(), &value);
        if (status != napi_ok) return nullptr;

        return value;
    }

    napi_value notify(napi_env env, napi_callback_info info) {
        napi_status status;
        size_t argc = 1;
        napi_value args[1];
        status = napi_get_cb_info(env, info, &argc, args, nullptr, nullptr);
        if (status != napi_ok) return nullptr;

        if (argc != 1) {
            napi_throw_error(env, nullptr, "Expected one string argument");
        }

        size_t len;
        status = napi_get_value_string_utf8(env, args[0], nullptr, 0, &len);
        if (status != napi_ok) return nullptr;

        char* state = new char[len + 1];
        status = napi_get_value_string_utf8(env, args[0], state, len + 1, nullptr);
        int res = sd_notify(0, state);
        delete[] state;

        napi_value value;
        status = napi_create_int32(env, res, &value);
        if (status != napi_ok) return nullptr;

        return value;
    }
}

napi_value init(napi_env env, napi_value exports) {
    napi_status status;

    napi_value listen_fds_start_int32;
    napi_value booted_fn;
    napi_value notify_fn;

    status = napi_create_int32(env, SD_LISTEN_FDS_START, &listen_fds_start_int32);
    if (status != napi_ok) return NULL;
    status = napi_create_function(env, NULL, 0, daemon::booted, NULL, &booted_fn);
    if (status != napi_ok) return NULL;
    status = napi_create_function(env, NULL, 0, daemon::notify, NULL, &notify_fn);
    if (status != napi_ok) return NULL;

    status = napi_set_named_property(env, exports, "LISTEN_FDS_START", listen_fds_start_int32);
    if (status != napi_ok) return NULL;
    status = napi_set_named_property(env, exports, "booted", booted_fn);
    if (status != napi_ok) return NULL;
    status = napi_set_named_property(env, exports, "notify", notify_fn);
    if (status != napi_ok) return NULL;

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init);
