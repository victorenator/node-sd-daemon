#include <nan.h>
#include <node.h>

#include <systemd/sd-daemon.h>

namespace daemon {

    NAN_METHOD(booted) {
        Nan::HandleScope scope;

        const int res = sd_booted();

        info.GetReturnValue().Set(Nan::New<v8::Integer>(res));
    }

    NAN_METHOD(notify) {
        Nan::HandleScope scope;

        if (!(info.Length() == 1 && info[0]->IsString())) {
            Nan::ThrowTypeError("Expected one string argument");
            return;
        }

        v8::String::Utf8Value state(info[0]);

        const int res = sd_notify(0, *state);

        info.GetReturnValue().Set(Nan::New<v8::Integer>(res));
    }

    void init(v8::Handle<v8::Object> exports) {
        exports->Set(Nan::New("notify").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(notify)->GetFunction());
        exports->Set(Nan::New("booted").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(booted)->GetFunction());
        exports->Set(Nan::New("LISTEN_FDS_START").ToLocalChecked(), Nan::New<v8::Integer>(SD_LISTEN_FDS_START));
    }
}

NODE_MODULE(daemon, daemon::init)
