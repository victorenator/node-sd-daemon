#include <nan.h>
#include <node.h>

#include <systemd/sd-daemon.h>

namespace daemon {

    NAN_METHOD(booted) {
        NanScope();

        const int res = sd_booted();

        NanReturnValue(NanNew<v8::Integer>(res));
    }

    NAN_METHOD(notify) {
        NanScope();

        if (!(args.Length() == 1 && args[0]->IsString())) {
            NanThrowTypeError("Expected one string argument");
            NanReturnUndefined();
        }

        v8::String::Utf8Value state(args[0]);

        const int res = sd_notify(0, *state);

        NanReturnValue(NanNew<v8::Integer>(res));
    }

    void init(v8::Handle<v8::Object> exports) {
        exports->Set(NanNew<v8::String>("notify"), NanNew<v8::FunctionTemplate>(notify)->GetFunction());
        exports->Set(NanNew<v8::String>("booted"), NanNew<v8::FunctionTemplate>(booted)->GetFunction());
        exports->Set(NanNew<v8::String>("LISTEN_FDS_START"), NanNew<v8::Integer>(SD_LISTEN_FDS_START));
    }
}

NODE_MODULE(daemon, daemon::init)
