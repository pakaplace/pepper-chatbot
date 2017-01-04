curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type" : "call_to_actions",
  "thread_state" : "existing_thread",
  "call_to_actions":[
    {
      "type":"postback",
      "title":"Wakeup time",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_WAKEUP"
    },
    {
      "type":"postback",
      "title":"Reflection time",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_REFLECTION_TIME"
    },
    {
      "type":"postback",
      "title":"Tasks",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_TASKS"
    },
    {
      "type":"postback",
      "title":"Change city",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_CITY"
    }
  ]
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAACGElIklxMBAJS1bm45A140OVBRuvGlIHAVhTBRbMZB6zZAJ3GeNEs7Sc7cWtaZApuF3xhYtQYNPOZAIcej8yLn4g2SFfstxznmOq6xrglbzInATlqfuGoiZBTp6xnSsc1ds0cNrVhm2Ccwen6ZCdacQBeqe7S5NZAvywb7pKFtwZDZD"