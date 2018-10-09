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

        Nan::Utf8String state(info[0]);

        const int res = sd_notify(0, *state);

        info.GetReturnValue().Set(Nan::New<v8::Integer>(res));
    }

    NAN_METHOD(notify_with_fds) {
        Nan::HandleScope scope;

        if (info.Length() != 2) {
            Nan::ThrowTypeError("Expected two arguments");
            return;
        }

        if (!info[0]->IsString()) {
            Nan::ThrowTypeError("Expected string as first argument");
            return;
        }

        if (!info[0]->IsArray()) {
            Nan::ThrowTypeError("Expected array as second argument");
            return;
        }

        Nan::Utf8String state(info[0]);

        v8::Local<v8::Array> fdsArray = v8::Local<v8::Array>::Cast(info[1]);
        unsigned int n_fds = fdsArray->Length();
        int fds[n_fds];
        for (unsigned int i = 0; i < n_fds; i++) {
            fds[i] = v8::Local<v8::Int32>::Cast(fdsArray->Get(i))->Value();
        }

        const int res = sd_pid_notify_with_fds(0, 0, *state, fds, n_fds);

        info.GetReturnValue().Set(Nan::New<v8::Integer>(res));
    }

    void init(v8::Handle<v8::Object> exports) {
        exports->Set(Nan::New("notify").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(notify)->GetFunction());
        exports->Set(Nan::New("booted").ToLocalChecked(), Nan::New<v8::FunctionTemplate>(booted)->GetFunction());
        exports->Set(Nan::New("LISTEN_FDS_START").ToLocalChecked(), Nan::New<v8::Integer>(SD_LISTEN_FDS_START));
    }
}

NODE_MODULE(daemon, daemon::init)
