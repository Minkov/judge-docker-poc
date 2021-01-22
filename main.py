import docker
import subprocess

mocha_path = 'C:\\Users\\User\\Documents\\js-exam\\node_modules\\.bin\\mocha.cmd'
tests_path = 'C:\\Users\\User\\Documents\\js-exam\\test'
image_name = 'nginx'
path_to_project = 'C:\\Users\\User\\Documents\\projects\\judge-docker-poc\\skeleton\\app'
path_to_nginx_conf = 'C:\\Users\\User\\Documents\\projects\\judge-docker-poc\\skeleton\\nginx.conf'
port = 8546


class DockerExecutor:
    def __init__(self):
        self.client = docker.from_env()
        self.container = self.client.containers.create(
            image=image_name,
            ports={'80/tcp': port},
            volumes={
                path_to_nginx_conf: {
                    'bind': '/etc/nginx/nginx.conf',
                    'mode': 'ro',
                },
                path_to_project: {
                    'bind': '/usr/share/nginx/html',
                    'mode': 'ro',
                },
            },
        )

    def start(self):
        self.container.start()

    def stop(self):
        self.container.stop()
        self.container.wait()
        self.container.remove()


executor = DockerExecutor()

executor.start()

commands = [mocha_path, tests_path, '-R', 'min']

process = subprocess.run(
    commands,
    capture_output=True
)


executor.stop()
