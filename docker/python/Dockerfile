FROM ubuntu:latest

# Install Python and pip
RUN apt-get update && apt-get install -y \
    curl \
    && apt-get install -y python3 python3-pip \
    && python3 --version \
    && pip3 --version

# Set the working directory
WORKDIR /usr/src/app

# Copy the entrypoint script
COPY entrypoint.sh .

# Ensure the entrypoint script is executable
RUN chmod +x entrypoint.sh

# Set the entrypoint
ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
