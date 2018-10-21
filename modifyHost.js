const { execSync } = require('child_process');
const hostify = require('hostify').operations;

const PORT = 3001;
const host = 'example.com';

const hostFilter = {
  filterHostFn: val => val.includes(host),
};

function getHosts() {
  return hostify.list(hostFilter);
}


try {
  execSync(`echo "
  rdr pass inet proto tcp from any to any port 80 -> 127.0.0.1 port ${PORT}
  rdr pass inet proto tcp from any to any port 443 -> 127.0.0.1 port ${PORT}
  " | sudo pfctl -ef -`);
} catch (e) {
  // supress err
}


// add hostfile entry if non exist
if (getHosts().length <= 0) {
  hostify.add({
    entries: [
      { ip: '127.0.0.1', host, comment: 'TEMP DEV' },
    ],
  });
}

// cleanup hostfile on exit
process.on('SIGINT', () => {
  hostify.delete(hostFilter);
  // flush rules
  execSync('sudo pfctl -F all -f /etc/pf.conf');
  process.exit(2);
});

process.stdin.resume();
