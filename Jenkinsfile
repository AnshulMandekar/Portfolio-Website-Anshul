pipeline {
    agent any

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    parameters {
        booleanParam(
            name: 'DEPLOY_APPLICATION',
            defaultValue: true,
            description: 'Deploy the Docker container on the host machine upon successful build'
        )
        booleanParam(
            name: 'PUSH_TO_REGISTRY',
            defaultValue: false,
            description: 'Push the built Docker image to Docker Hub / Registry'
        )
        string(
            name: 'DOCKER_IMAGE_REPO',
            defaultValue: 'anshulmandekar/portfolio-website',
            description: 'Docker Hub repository name (e.g. username/repo-name)'
        )
        string(
            name: 'HOST_PORT',
            defaultValue: '8080',
            description: 'Host port to map and expose the website container'
        )
    }

    environment {
        IMAGE_NAME           = 'portfolio-website'
        IMAGE_TAG            = "${env.BUILD_NUMBER}"
        CONTAINER_NAME       = 'portfolio_website_prod'
        DOCKER_CREDENTIALS_ID = 'dockerhub-credentials' // Jenkins credential ID for Docker Hub (Username with password)
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code...'
                checkout scm
            }
        }

        stage('Code Validation & Linting') {
            steps {
                echo 'Validating critical portfolio assets and configuration...'
                script {
                    def requiredFiles = [
                        'index.html',
                        'game.html',
                        'style.css',
                        'script.js',
                        'nginx.conf',
                        'Dockerfile'
                    ]

                    for (file in requiredFiles) {
                        if (!fileExists(file)) {
                            error "Missing required file: ${file}"
                        }
                    }
                    echo 'All essential project files verified successfully!'
                }
            }
        }

        stage('Docker Build') {
            steps {
                echo "Building Docker image: ${IMAGE_NAME}:${IMAGE_TAG} and ${IMAGE_NAME}:latest..."
                script {
                    if (isUnix()) {
                        sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest -t ${params.DOCKER_IMAGE_REPO}:${IMAGE_TAG} -t ${params.DOCKER_IMAGE_REPO}:latest ."
                    } else {
                        bat "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest -t ${params.DOCKER_IMAGE_REPO}:${IMAGE_TAG} -t ${params.DOCKER_IMAGE_REPO}:latest ."
                    }
                }
            }
        }

        stage('Test & Healthcheck') {
            steps {
                echo 'Testing built Docker container locally...'
                script {
                    def testContainer = "portfolio_test_${env.BUILD_NUMBER}"
                    def testPort = "8888"

                    if (isUnix()) {
                        sh """
                            docker run -d --name ${testContainer} -p ${testPort}:80 ${IMAGE_NAME}:${IMAGE_TAG}
                            sleep 3
                            curl -f http://localhost:${testPort}/healthz || curl -f http://localhost:${testPort}/
                            docker stop ${testContainer}
                            docker rm ${testContainer}
                        """
                    } else {
                        bat """
                            docker run -d --name ${testContainer} -p ${testPort}:80 ${IMAGE_NAME}:${IMAGE_TAG}
                            powershell -Command "Start-Sleep -Seconds 3; try { Invoke-RestMethod -Uri http://localhost:${testPort}/healthz } catch { Invoke-RestMethod -Uri http://localhost:${testPort}/ }"
                            docker stop ${testContainer}
                            docker rm ${testContainer}
                        """
                    }
                }
            }
        }

        stage('Push to Registry') {
            when {
                expression { return params.PUSH_TO_REGISTRY == true }
            }
            steps {
                echo "Pushing image to registry: ${params.DOCKER_IMAGE_REPO}..."
                script {
                    withCredentials([usernamePassword(
                        credentialsId: "${env.DOCKER_CREDENTIALS_ID}",
                        usernameVariable: 'DOCKER_USER',
                        passwordVariable: 'DOCKER_PASS'
                    )]) {
                        if (isUnix()) {
                            sh """
                                echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin
                                docker push ${params.DOCKER_IMAGE_REPO}:${IMAGE_TAG}
                                docker push ${params.DOCKER_IMAGE_REPO}:latest
                                docker logout
                            """
                        } else {
                            bat """
                                echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin
                                docker push ${params.DOCKER_IMAGE_REPO}:${IMAGE_TAG}
                                docker push ${params.DOCKER_IMAGE_REPO}:latest
                                docker logout
                            """
                        }
                    }
                }
            }
        }

        stage('Deploy Container') {
            when {
                expression { return params.DEPLOY_APPLICATION == true }
            }
            steps {
                echo "Deploying container ${CONTAINER_NAME} on port ${params.HOST_PORT}..."
                script {
                    if (isUnix()) {
                        sh """
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
                            docker run -d \\
                                --name ${CONTAINER_NAME} \\
                                --restart unless-stopped \\
                                -p ${params.HOST_PORT}:80 \\
                                ${IMAGE_NAME}:${IMAGE_TAG}
                        """
                    } else {
                        bat """
                            docker stop ${CONTAINER_NAME} || echo No container to stop
                            docker rm ${CONTAINER_NAME} || echo No container to remove
                            docker run -d --name ${CONTAINER_NAME} --restart unless-stopped -p ${params.HOST_PORT}:80 ${IMAGE_NAME}:${IMAGE_TAG}
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up dangling Docker images...'
            script {
                if (isUnix()) {
                    sh 'docker image prune -f || true'
                } else {
                    bat 'docker image prune -f || echo Prune done'
                }
            }
        }
        success {
            echo "=========================================================="
            echo "Pipeline succeeded!"
            echo "Portfolio site is running at: http://localhost:${params.HOST_PORT}"
            echo "=========================================================="
        }
        failure {
            echo "=========================================================="
            echo "Pipeline failed! Check the console logs for debugging."
            echo "=========================================================="
        }
    }
}
