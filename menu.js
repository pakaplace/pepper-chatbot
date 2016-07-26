curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type" : "call_to_actions",
  "thread_state" : "existing_thread",
  "call_to_actions":[
    {
      "type":"postback",
      "title":"Wakeup Time",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_WAKEUP"
    },
    {
      "type":"postback",
      "title":"Routines",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_ROUTINES"
    },
    {
      "type":"postback",
      "title":"Message Frequency",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_MESSAGE"
    },
     {
      "type":"postback",
      "title":"Reflection Time",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_REFLECTION"
    },
  ]
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAACGElIklxMBAK0T3R5r0mZCq3ZAl9WgtCm8YWOrk00Lfr68DttqCLvEJxO7ZAFf47nVrGJ3oheDbfUZBTFZBOyK9oRKkMTJ4TiQtYfRyULxbISI2gsD1gpX9f6iL27gjRJB6l2Qodpt3DQZA4c3dhuvUrnbad7JNmp4DoQDEY6AZDZD"