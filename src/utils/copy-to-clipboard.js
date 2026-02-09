import { spawn } from 'node:child_process';

export default (string) => {
  const proc = spawn('pbcopy');
  proc.stdin.write(string);
  proc.stdin.end();
};
