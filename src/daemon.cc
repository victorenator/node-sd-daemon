#include <node.h>
#include <nan.h>

#include <systemd/sd-daemon.h>

using v8::FunctionTemplate;
using v8::Handle;
using v8::Number;
using v8::Object;
using v8::String;

NAN_METHOD(booted) {
    NanScope();
        
    const int res = sd_booted();

    NanReturnValue(NanNew<Number>(res));
}
    
NAN_METHOD(notify) {
    NanScope();
        
    if (!(args.Length() == 1 && args[0]->IsString())) {
        NanThrowTypeError("expected one string argument");
        NanReturnUndefined();
    }
        
    String::Utf8Value state(args[0]);
        
    const int res = sd_notify(0, *state);

    NanReturnValue(NanNew<Number>(res));
}

void InitAll(Handle<Object> exports) {
    exports->Set(NanNew<String>("notify"), NanNew<FunctionTemplate>(notify)->GetFunction());
    exports->Set(NanNew<String>("booted"), NanNew<FunctionTemplate>(booted)->GetFunction());
    exports->Set(NanNew<String>("LISTEN_FDS_START"), NanNew<Number>(SD_LISTEN_FDS_START));
}

NODE_MODULE(daemon, InitAll)
