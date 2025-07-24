const awsServiceClientLookup = {
    "client-s3": "S3Client",
    "client-lambda": "LambdaClient",
    "client-dynamodb": "DynamoDBClient",
    "client-rds": "RDSClient",
    "client-ec2": "EC2Client",
    "client-iam": "IAMClient",
    "client-sts": "STSClient",
    "client-sqs": "SQSClient",
    "client-sns": "SNSClient",
    "client-cloudwatch": "CloudWatchClient",
    "client-api-gateway": "APIGatewayClient",
    "client-route-53": "Route53Client",
    "client-secrets-manager": "SecretsManagerClient",
    "client-cloudformation": "CloudFormationClient",
    "client-cloudtrail": "CloudTrailClient",
    "client-elastic-load-balancing-v2": "ElasticLoadBalancingV2Client",
    "client-vpc-lattice": "VPCLatticeClient",
    "client-cognito-identity-provider": "CognitoIdentityProviderClient",
    "client-kms": "KMSClient",
    "client-ecs": "ECSClient",
    "client-eks": "EKSClient",
    "client-ecr": "ECRClient",
    "client-apprunner": "AppRunnerClient",
    "client-docdb": "DocDBClient",
    "client-elasticache": "ElastiCacheClient",
    "client-athena": "AthenaClient",
    "client-redshift": "RedshiftClient",
    "client-glue": "GlueClient",
    "client-kinesis": "KinesisClient",
    "client-firehose": "FirehoseClient",
    "client-timestream-query": "TimestreamQueryClient",
    "client-lakeformation": "LakeFormationClient",
    "client-dataexchange": "DataExchangeClient",
    "client-codebuild": "CodeBuildClient",
    "client-codepipeline": "CodePipelineClient",
    "client-codedeploy": "CodeDeployClient",
    "client-codecommit": "CodeCommitClient",
    "client-sagemaker": "SageMakerClient",
    "client-amplify": "AmplifyClient",
    "client-config-service": "ConfigServiceClient",
    "client-guardduty": "GuardDutyClient",
    "client-securityhub": "SecurityHubClient",
    "client-inspector2": "Inspector2Client",
    "client-cloudfront": "CloudFrontClient",
    "client-direct-connect": "DirectConnectClient",
    "client-networkmanager": "NetworkManagerClient",
    "client-organizations": "OrganizationsClient",
    "client-cost-explorer": "CostExplorerClient",
    "client-ses": "SESClient",
    "client-ssm": "SSMClient",
    "client-xray": "XRayClient"
  };

class AWSModuleLoader {
    constructor() {
        this.moduleCache = {};
    }

    _loadModule(packageName, cache) {
        if (cache[packageName]) {
            return cache[packageName];
        }

        let modulePath, awsModule;
        modulePath = `@aws-sdk/${packageName}`;

        try {
            awsModule = require(modulePath);
            cache[packageName] = awsModule;
        } catch (error) {
            console.error(`Error loading module "${modulePath}" for service "${packageName}":`, error.message);
            return undefined;
        }

        return awsModule;
    }

    getClient(packageName) {
        const module = this._loadModule(packageName, this.moduleCache);
        const ClientName = awsServiceClientLookup[packageName];

        if (module[ClientName]) {
            return module[ClientName];
        } else {
            console.error(`Client class "${ClientName}" not found in module".`);
            return undefined;
        }
    }

    getCommand(packageName, commandName) {
        const module = this._loadModule(packageName, this.moduleCache);

        return module[commandName];
    }
}

const awsLoader = new AWSModuleLoader();

module.exports = {
    getClient: (packageName) => awsLoader.getClient(packageName),
    getCommand: (packageName, commandName) => awsLoader.getCommand(packageName, commandName)
};