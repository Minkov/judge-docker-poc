import shutil
import tarfile
from os import chdir, remove
from os.path import dirname, join, basename

import docker


def copy_to_container(container, source, destination):
    chdir(dirname(source))
    local_dest_name = join(dirname(source), basename(destination))
    if local_dest_name != source:
        shutil.copy2(source, local_dest_name)
    dst_name = basename(destination)
    tar_path = local_dest_name + '.tar'

    tar = tarfile.open(tar_path, mode='w')
    try:
        tar.add(dst_name)
    finally:
        tar.close()

    data = open(tar_path, 'rb').read()
    container.put_archive(dirname(destination), data)

    remove(tar_path)
    remove(local_dest_name)


class DockerExecutor:
    code_file_path = None
    image_name = 'nginx'

    def __init__(self):
        self.client = docker.from_env()
        self.container = self.client.containers.create(
            image=self.image_name,
            command=f'sh -c "tail -f /dev/null"',
            ports={'80/tcp': 8082},
            volumes={
                '/home/doncho/repos/judge-strategies/docker-strategy/skeleton/nginx.conf': {
                    'bind': '/etc/nginx/nginx.conf',
                    'mode': 'ro',
                },
                '/home/doncho/repos/judge-strategies/docker-strategy/skeleton/app': {
                    'bind': '/usr/share/nginx/html',
                    'mode': 'ro',
                },
            },
        )
        self.container.start()
        pass


DockerExecutor()
