pipeline {
    agent any
    environment {
        PROJECT_ID = "spry-compound-408107"
        CLUSTER_NAME = "k8s-cluster"
        LOCATION = "asia-southeast1"
        CREDENTIALS_ID = 'test'
    }
    stages {
        stage('pull from github repo'){
            steps{
                git "https://github.com/Admin4Jarvis/buksapp-api-master.git"
            }
        }
        stage('build docker image'){
            steps{
                sh "docker build -t admin4jarvis/buksapp-backend:${env.BUILD_ID} ."                
            }
        }
        stage('push docker image to dockerhub'){
            steps{
                withCredentials([string(credentialsId: 'DOCKER_PASS', variable: 'docker_pass')]) {
                    sh "docker login -u admin4jarvis -p Santhipavan@27"
                }
                sh "docker push admin4jarvis/buksapp-backend:${env.BUILD_ID}"
            }
            
        }
        stage('deploy on k8 cluster'){
            steps{
                sh "sed -i 's/tagversion/${env.BUILD_ID}/g' backend-k8.yaml"
                step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'backend-k8.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])   
            }
        }
    }
}
