#!/bin/bash

set -e

eval $(ssh-agent -s)
echo "$EC2_PRIVATE_KEY" | tr -d '\r' | ssh-add - > /dev/null

# disable the host key checking.
mkdir -p ~/.ssh
touch ~/.ssh/config
echo -e "Host *\n\tStrictHostKeyChecking no\n\n" >> ~/.ssh/config

echo "SSH to the EC2 instance and run the run.sh script..."

ssh "$EC2_USER"@"$EC2_SERVER" 'bash' < packages/api/work-spaces/scripts/run.sh
