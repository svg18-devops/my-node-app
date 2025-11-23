pipeline {
  agent any

  environment {
    DOCKER_IMAGE = "jarvi18/my-node-app"
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Build image') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker build -t $DOCKER_IMAGE:$IMAGE_TAG .
          '''
        }
      }
    }

    stage('Login & Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push $DOCKER_IMAGE:$IMAGE_TAG
            docker tag $DOCKER_IMAGE:$IMAGE_TAG $DOCKER_IMAGE:latest
            docker push $DOCKER_IMAGE:latest
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        withCredentials([file(credentialsId: 'kubeconfig-file', variable: 'KUBECONFIG_FILE')]) {
          sh '''
            # Use Jenkins HOME directory (jenkins has full access here)
            # mkdir -p $HOME/.kube
            # cp "$KUBECONFIG_FILE" $HOME/.kube/config
            # export KUBECONFIG=$HOME/.kube/config

            # export KUBECONFIG=$WORKSPACE/kubeconfig
            #cp "$KUBECONFIG_FILE" $KUBECONFIG
            
            # mkdir -p $WORKSPACE/.kube
            export KUBECONFIG=$WORKSPACE/.kube/config
            cp "$KUBECONFIG_FILE" $WORKSPACE/.kube/config
            
            # update k8s manifests with the new image tag (simple sed)
            sed -i "s|jarvi18/my-node-app:.*|${DOCKER_IMAGE}:${IMAGE_TAG}|g" k8s/deployment.yaml
            
            echo "🔹 Kubeconfig set successfully!"
            kubectl get nodes
            
            kubectl apply -f k8s/deployment.yaml
            kubectl apply -f k8s/service.yaml
          '''
        }
      }
    }
  }

  post {
    always {
      sh 'docker logout || true'
    }
  }
}

