pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Docker') {
            steps {
                bat 'docker --version'
                bat 'docker compose version'
            }
        }

        stage('Build Docker Images') {
            steps {
                bat 'docker compose build'
            }
        }

        stage('Start Application') {
            steps {
                bat 'docker compose up -d'
            }
        }

        stage('Check Containers') {
            steps {
                bat 'docker compose ps'
            }
        }
    }

    post {
        always {
            echo 'Jenkins pipeline completed.'
        }
    }
}
