〉node ./lib/node/plinko.js > ./data/june-10-2-headless-sim.csv
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
 1: node::Abort() [/usr/local/bin/node]
 2: node::FatalException(v8::Isolate*, v8::Local<v8::Value>, v8::Local<v8::Message>) [/usr/local/bin/node]
 3: v8::internal::V8::FatalProcessOutOfMemory(char const*, bool) [/usr/local/bin/node]
 4: v8::internal::Factory::NewFixedArray(int, v8::internal::PretenureFlag) [/usr/local/bin/node]
 5: v8::internal::HashTable<v8::internal::NameDictionary, v8::internal::NameDictionaryShape, v8::internal::Handle<v8::internal::Name> >::EnsureCapacity(v8::internal::Handle<v8::internal::NameDictionary>, int, v8::internal::Handle<v8::internal::Name>, v8::internal::PretenureFlag) [/usr/local/bin/node]
 6: v8::internal::JSObject::AddSlowProperty(v8::internal::Handle<v8::internal::JSObject>, v8::internal::Handle<v8::internal::Name>, v8::internal::Handle<v8::internal::Object>, v8::internal::PropertyAttributes) [/usr/local/bin/node]
 7: v8::internal::Object::AddDataProperty(v8::internal::LookupIterator*, v8::internal::Handle<v8::internal::Object>, v8::internal::PropertyAttributes, v8::internal::Object::ShouldThrow, v8::internal::Object::StoreFromKeyed) [/usr/local/bin/node]
 8: v8::internal::Runtime::SetObjectProperty(v8::internal::Isolate*, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::Object>, v8::internal::Handle<v8::internal::Object>, v8::internal::LanguageMode) [/usr/local/bin/node]
 9: v8::internal::Runtime_SetProperty(int, v8::internal::Object**, v8::internal::Isolate*) [/usr/local/bin/node]
10: 0x270ded3092a7
11: 0x270ded6b1205
[1]    13296 abort      node ./lib/node/plinko.js > ./data/june-10-2-headless-sim.csv
