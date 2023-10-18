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
  default = "" //"us-east-1"
}

variable "source_ami" {
  type    = string
  default = "dummy" //"ami-06db4d78cb1d3bbf9" # Debian 22.04 LTS
}

variable "ssh_username" {
  type    = string
  default = "dummy" //"admin"
}

variable "subnet_id" {
  type    = string
  default = "" //"subnet-0e534a2d740b0e658"
}


variable "ami_users" {
  type    = list(string)
  default = [] //["715971441311"] # demo AWS profile
}

variable "aws_access_key" {
  type    = string
  default = "" //"AKIA5CZKPWKC2EJXDFVY" # dev aws_access_key
}

variable "aws_secret_key" {
  type    = string
  default = "" //"aD952PIMGlDGGn1tyFh517EZ+0HDQylMP4szms3i" #dev aws_secret_key
}

variable "artifact_path" {
  type    = string
  default = ""//"./forkedWebappRepo.zip"
}
# https://www.packer.io/plugins/builders/amazon/ebs
source "amazon-ebs" "my-ami" {
  region          = "${var.aws_region}"
  ami_name        = "csye6225_${formatdate("YYYY_MM_DD_hh_mm_ss", timestamp())}"
  ami_description = "AMI for CSYE 6225"
  ami_regions = [
    "us-east-1",
  ]
  ami_users  = "${var.ami_users}"      # sharing with demo
  access_key = "${var.aws_access_key}" # Use environment variable
  secret_key = "${var.aws_secret_key}" # Use environment variable

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
    source      = "${var.artifact_path}" //"./forkedWebappRepo.zip"
    destination = "~/"                   // trailing slash important for directories, also, transfer to a location accessible by non-sudo users
  }

  provisioner "shell" {
    environment_vars = [
      "DEBIAN_FRONTEND=noninteractive",
      "CHECKPOINT_DISABLE=1"
    ]
    scripts = ["./scripts/update_packages.sh",
      "./scripts/setup_artifact.sh",
    "./scripts/setup_dependencies.sh"] # setup maria-db server, node, npm and create database 'db_sequelize_mysql' 
  }
}