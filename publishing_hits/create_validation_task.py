import boto3
MTURK_SANDBOX = 'https://mturk-requester-sandbox.us-east-1.amazonaws.com'
MTURK_PROD = 'https://mturk-requester.us-east-1.amazonaws.com'

ak_ai2 = '<access-key>'
sak_ai2 = '<secret-access-key>'

mturk = boto3.client('mturk',
   aws_access_key_id = ak_ai2,
   aws_secret_access_key = sak_ai2,
   region_name='us-east-1',
   endpoint_url = MTURK_PROD
)

print "I have " + mturk.get_account_balance()['AvailableBalance'] + " in my Sandbox account"


for qid in range(0,1):
    for start_ind in range(0,50):
        question = open(name='validation.xml',mode='r').read()
        question = question.replace("var question_start_index = 0", "var question_start_index = "+str(start_ind*10))
        new_hit = mturk.create_hit(
            Title = 'Answer questions based on passages (Custom)',
            Description = 'Please look at the hit and answer a few questions based on the passages. It generally takes around 10-15 mins',
            Keywords = 'question answering',
            Reward = '1.0',
            MaxAssignments = 1,
            LifetimeInSeconds = 172800,
            AssignmentDurationInSeconds = 172800,
            AutoApprovalDelayInSeconds = 259200,
            # AutoApprovalDelayInSeconds = 86400,
            Question = question,
            QualificationRequirements=[
                # good turker pool
                {
                      'QualificationTypeId':"36X0O00ZJAUZ3LMO08UNRKB8V735VK",
                      'Comparator': 'EqualTo',
                      'IntegerValues':[100]
                }
                # turkers with more than 5000 HITS
                # {
                #         'QualificationTypeId':"00000000000000000040",
                #         'Comparator': 'GreaterThanOrEqualTo',
                #         'IntegerValues':[5000]
                # },
                # turkers with > 99% approval rate
                # {
                #         'QualificationTypeId':"000000000000000000L0",
                #         'Comparator': 'GreaterThanOrEqualTo',
                #         'IntegerValues':[99]
                # }
            ],
        )
        print("{0}\t{1}\t{2}".format("Validation_"+str(start_ind+1),"https://worker.mturk.com/mturk/preview?groupId=" + new_hit['HIT']['HITGroupId'], new_hit['HIT']['HITId']))
    

print "I have " + mturk.get_account_balance()['AvailableBalance'] + " in my account"
