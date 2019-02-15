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

for qid in range(0,30):
    question = open(name='questions_sample.xml',mode='r').read()
    new_hit = mturk.create_hit(
        Title = 'Sports question answers',
        Description = 'Please look at the hit and write a few question and answer based on the passages. It generally takes around 30-45 mins',
        Keywords = 'question answering',
        Reward = '5.0',
        MaxAssignments = 5,
        LifetimeInSeconds = 172800,
        AssignmentDurationInSeconds = 172800,
        AutoApprovalDelayInSeconds = 259200,
        # AutoApprovalDelayInSeconds = 86400,
        Question = question,
        QualificationRequirements=[
            # Master Qualification Sandbox 2ARFPLSP75KLA8M8DH1HTEQVJT3SY6
            # Master Qualification for Prod 2F1QJWKUDD8XADTFD2Q0G6UTO95ALH
            # {
            #     'QualificationTypeId': '2F1QJWKUDD8XADTFD2Q0G6UTO95ALH',
            #     'Comparator': 'Exists', 
            # },
            #Qualification for US
            {
                'QualificationTypeId': '00000000000000000071',
                'Comparator': 'EqualTo', 
                'LocaleValues':[{
                      'Country':'US'
                  }]
            }
            ## Good tuker pool for NFL
            # {
            #       'QualificationTypeId':"3M3HXOD6K9394JG7PUA1AFZAEAR7IR",
            #       'Comparator': 'EqualTo',
            #       'IntegerValues':[100]
            # }
            ## Good tuker pool for History GT
            # {
            #       'QualificationTypeId':"3LRUXMYH0RF97HQYFONT1VJZK4J29O",
            #       'Comparator': 'EqualTo',
            #       'IntegerValues':[100]
            # }            
        ],
    )
    # print("{0}\t{1}\t{2}".format("History_"+str(qid),"https://worker.mturk.com/mturk/preview?groupId=" + new_hit['HIT']['HITGroupId'], new_hit['HIT']['HITId']))
    print("{0}\t{1}\t{2}".format("NFL_"+str(qid),"https://worker.mturk.com/mturk/preview?groupId=" + new_hit['HIT']['HITGroupId'], new_hit['HIT']['HITId']))
print "I have " + mturk.get_account_balance()['AvailableBalance'] + " in my account"


