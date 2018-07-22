if [[ -z "$AWS_SECRET_ACCESS_KEY" ]]; then
  echo ">>> Please make sure you configured your AWS Credentials locally as environment variables"
  echo "AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}"
  echo "AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}"
  echo "AWS_SESSION_TOKEN: ${AWS_SESSION_TOKEN}"
  echo "AWS_DEFAULT_REGION: ${AWS_DEFAULT_REGION}"
else
  echo ">>> Installing Deployment Dependencies"
  sudo SLS_DEBUG=* npm run serverless -- deploy --stage ${DEPLOY_ENVIRONMENT} --verbose
fi
