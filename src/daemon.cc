#include <v8.h>
#include <nodejs/src/node.h>

#include <systemd/sd-daemon.h>

namespace daemon {

    v8::Handle<v8::Value> booted(const v8::Arguments& args) {
        v8::HandleScope scope;
        
        const int res = sd_booted();
        return scope.Close(v8::Integer::New(res));
    }
    
    v8::Handle<v8::Value> notify(const v8::Arguments& args) {
        v8::HandleScope scope;
        
        if (!(args.Length() == 1 && args[0]->IsString())) {
            v8::ThrowException(v8::Exception::TypeError(v8::String::New("Expected one string argument")));
            return scope.Close(v8::Undefined());
        }
        
        v8::String::Utf8Value state(args[0]);
        
        const int res = sd_notify(0, *state);
        return scope.Close(v8::Integer::New(res));
    }

    void init(v8::Handle<v8::Object> exports) {
        exports->Set(v8::String::NewSymbol("notify"), v8::FunctionTemplate::New(notify)->GetFunction());
        exports->Set(v8::String::NewSymbol("booted"), v8::FunctionTemplate::New(booted)->GetFunction());
    }
}

NODE_MODULE(daemon, daemon::init)