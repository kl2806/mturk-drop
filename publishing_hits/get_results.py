import boto3
MTURK_SANDBOX = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
MTURK_PROD = 'https://mturk-requester.us-east-1.amazonaws.com'

ak_ai2 = '<access-key>'
sak_ai2 = '<secret-access-key>'

mturk = boto3.client('mturk',
   aws_access_key_id = ak_ai2,
   aws_secret_access_key = sak_ai2,
   region_name='us-east-1',
   endpoint_url = MTURK_SANDBOX
)

import xmltodict

hit_id = '<hit-id>'
worker_results = mturk.list_assignments_for_hit(HITId=hit_id, AssignmentStatuses=['Submitted', 'Approved'])
print("Number of Submissions for hit : "+ hit_id+" so far : " + str(worker_results["NumResults"])+"\n")

if worker_results['NumResults'] > 0:
  for assignment in worker_results['Assignments']:
     xml_doc = xmltodict.parse(assignment['Answer'])
     print("Worker Id was: " + format(assignment['WorkerId'])+"\n")
     print("Worker's answer was:"+"\n")
     if type(xml_doc['QuestionFormAnswers']['Answer']) is list:
        # Multiple fields in HIT layout
        for answer_field in xml_doc['QuestionFormAnswers']['Answer']:
           prt_text = "For input field: " + answer_field['QuestionIdentifier']
           if answer_field['FreeText'] is None:
              answer_field['FreeText'] = 'None'
           prt_text += " Submitted answer: " + answer_field['FreeText']
           print(prt_text+"\n")
     else:
        # One field found in HIT layout
        print("For input field: " + xml_doc['QuestionFormAnswers']['Answer']['QuestionIdentifier']+"\n")
        print("Submitted answer: " + xml_doc['QuestionFormAnswers']['Answer']['FreeText']+"\n")

else:
  print("No results ready yet for "+hit_id+"\n")
print("--------------------"+"\n")
