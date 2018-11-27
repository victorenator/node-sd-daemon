#define NAPI_VERSION 3
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
    napi_value listenFdsStart;
    status = napi_create_int32(env, SD_LISTEN_FDS_START, &listenFdsStart);
    if (status != napi_ok) return nullptr;
    napi_property_descriptor desc[] = {
        {"LISTEN_FDS_START", nullptr, nullptr, nullptr, nullptr, listenFdsStart, napi_default, nullptr},
        {"booted", nullptr, daemon::booted, nullptr, nullptr, nullptr, napi_default, nullptr},
        {"notify", nullptr, daemon::notify, nullptr, nullptr, nullptr, napi_default, nullptr}
    };
    status = napi_define_properties(env, exports, 3, desc);
    if (status != napi_ok) return nullptr;
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, init);
