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
        sh '''
          docker build -t $DOCKER_IMAGE:$IMAGE_TAG .
        '''
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
            mkdir -p $WORKSPACE/.kube
            cp "$KUBECONFIG_FILE" $WORKSPACE/.kube/config
            export KUBECONFIG=$WORKSPACE/.kube/config
            # update k8s manifests with the new image tag (simple sed)
            sed -i "s|yourdockerhubusername/my-node-app:.*|${DOCKER_IMAGE}:${IMAGE_TAG}|g" k8s/deployment.yaml
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

