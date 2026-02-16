module.exports = {
  apps: [
    {
      name: "factura-pro",
      script: ".next/standalone/server.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      log_file: "logs/combined.log",
      time_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      max_memory_restart: "500M",
      watch: false,
      ignore_watch: ["node_modules", ".next"],
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      listen_timeout: 5000,
      shutdown_with_message: true,
    },
  ],
};
