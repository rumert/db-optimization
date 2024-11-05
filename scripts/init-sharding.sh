#!/bin/bash
echo "Initializing Sharded Cluster..."

wait_for_mongo() {
  local host=$1
  local port=$2
  until mongosh --host $host --port $port --eval "print('Waiting for MongoDB service to be ready...')" >/dev/null 2>&1; do
    echo "Waiting for $host:$port to be ready..."
    sleep 5
  done
}

echo "Waiting for Shard 1..."
wait_for_mongo "mongo-shard1" 27018

# Initialize Shard 1 Replica Set
echo "Initializing Shard 1 Replica Set..."
mongosh --host mongo-shard1 --port 27018 <<EOF
rs.initiate({
  _id: "shardReplSet1",
  members: [{ _id: 0, host: "mongo-shard1:27018" }]
});
EOF

echo "Waiting for Shard 2..."
wait_for_mongo "mongo-shard2" 27017

# Initialize Shard 2 Replica Set
echo "Initializing Shard 2 Replica Set..."
mongosh --host mongo-shard2 --port 27017 <<EOF
rs.initiate({
  _id: "shardReplSet2",
  members: [{ _id: 0, host: "mongo-shard2:27017" }]
});
EOF

echo "Waiting for Config Server..."
wait_for_mongo "mongo-config-server" 27019

# Initialize Config Server Replica Set
echo "Initializing Config Server Replica Set..."
mongosh --host mongo-config-server --port 27019 <<EOF
rs.initiate({
  _id: "configReplSet",
  configsvr: true,
  members: [{ _id: 0, host: "mongo-config-server:27019" }]
});
EOF

echo "Waiting for Mongos Router..."
wait_for_mongo "mongos-router" 27020

# Adding Shards to Mongos and Enabling Sharding
echo "Adding Shards to Mongos and Enabling Sharding..."
mongosh --host mongos-router --port 27020 <<EOF
    use db-optimization
    sh.addShard("shardReplSet1/mongo-shard1:27018");
    sh.addShard("shardReplSet2/mongo-shard2:27017");
    sh.enableSharding("db-optimization");
    sh.shardCollection("db-optimization.Data", { createdAt: 1 });
EOF