# devenv.nix
{ pkgs, ... }:

{
  cachix.enable = false;

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_20;
    npm.enable = true;
  };

  languages.typescript.enable = true;

  packages = with pkgs; [ git ];

  # Enable dotenv integration for loading .env files
  dotenv.enable = true;

  services.postgres = {
    enable = true;
    listen_addresses = "*";
    initialDatabases = [
      {
        name = "scheduler";
        user = "scheduler_user";
        pass = "scheduler_password";
      }
    ];
    initialScript = ''
      ALTER USER scheduler_user CREATEDB;
    '';
  };

  env.DATABASE_URL = "postgresql://scheduler_user:scheduler_password@localhost:5432/scheduler";

  scripts.setup.exec = ''
    echo "📦 Installing deps and generating Prisma client..."
    npm install
    npm run prisma -- generate
    npm run migrate
  '';

  enterShell = ''
    echo "👋  Welcome to Scheduler. Postgres is running. Use the aliases below:"
    echo ""
    echo "  ▶️  Run services:"
    echo "     $ npm run dev:backend   # backend API"
    echo "     $ npm run dev:frontend  # React frontend"  
    echo "     $ npm run dev           # both simultaneously"
    echo ""
    echo "  📥 Database operations:"
    echo "     $ npm run prisma -- migrate dev"
    echo "     $ npm run prisma -- studio"
    echo ""
  '';
}