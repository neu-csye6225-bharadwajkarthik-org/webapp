packer {
  required_plugins {
    amazon = {
      source  = "github.com/hashicorp/amazon"
      version = ">= 1.0.0"
    }
  }
}

variable "aws_region" {
  type    = string
  default = ""
}

variable "source_ami" {
  type    = string
  default = "dummy"
}

variable "ssh_username" {
  type    = string
  default = "dummy"
}

variable "subnet_id" {
  type    = string
  default = ""
}

variable "ami_users" {
  type    = list(string)
  default = []
}

variable "artifact_path" {
  type    = string
  default = ""
}
# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "my-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"
  ami_regions = [
    "us-east-1",
  ]
  ami_users = "${var.ami_users}" # sharing with demo

  aws_polling {
    delay_seconds = 120
    max_attempts  = 50
  }

  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"   # ami-06db4d78cb1d3bbf9
  ssh_username  = "${var.ssh_username}" # admin
  subnet_id     = "${var.subnet_id}"    # subnet-0e534a2d740b0e658

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/xvda"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = ["source.amazon-ebs.my-ami"]

  provisioner "file" {                   // provision the artifact
    source      = "${var.artifact_path}" //"./webapp.zip"
    destination = "~/"                   // trailing slash important for directories, also, transfer to a location accessible by non-sudo users
  }

  provisioner "file" {
    source      = "./packer/services/webapp.service"
    destination = "/tmp/webapp.service"
  }

  provisioner "file" {
    source      = "./packer/config/cloudwatch-config.json"
    destination = "/tmp/cloudwatch-config.json"
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    scripts = ["./packer/scripts/update_packages.sh",
      "./packer/scripts/setup_webapp_user.sh",
      "./packer/scripts/unzip_artifact.sh",
      "./packer/scripts/setup_artifact_dependencies.sh",
      "./packer/scripts/setup_cloudwatch_agent.sh",
    "./packer/scripts/start_webapp_service_daemon.sh"]
  }
}