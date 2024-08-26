const { exec } = require('child_process');

exec('npm run seed', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing seed script: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Seed script stderr: ${stderr}`);
        return;
    }
    console.log(`Seed script stdout: ${stdout}`);
});
