# Assests Management System 

- Express.js + Mongo DB for API
- React for Frontend
- Run project using docker compose.



## Backend 

```bash
npm init -y
npm install express mongoose bcryptjs jsonwebtoken dotenv
# create app.js
node app.js
node --watch app.js

```


ok, let's unified response format

status : bool
message : String
data : object or list of object
pagination : null or pagination object
error : object ( each fileds with array string )


## Basic Road Map

- [ ] Basic API 
- [ ] Docker
- [ ] Simple API Integration


## API တစ်ခုမှာ ဘာတွေ ပါမလဲ?

များတော့ များသား။

ပြန် နိုင်တဲ့ status code နဲ့ structure.

ဘယ်က စရေးလဲ?

- [ ] Model
- [ ] Service
- [ ] Controller
- [ ] Routing

ဒါဆို ရပြီ ဖြစ်မယ်။


Controller က ဘာလုပ်ပေးမလဲ?

HTTP Request / Response ကို စီမံပေးမယ်။
Request Validation တွေ ဘာတွေ လုပ်ပေးမယ်။
အဆင်ပြေပြေ response ပြန်ပေးမယ်။

Service
ဒါကတော့ လုံးဝ business logic တွေ ထားတဲ့ layer .
ဘာတွေ လက်ခံမလဲ? 
data တွေ လက်ခံမယ်။
data တွေပဲ ပြန်ပေးမယ်။

သူက ဘာကို မှီခိုကောင်း မှီခိုရမလဲဆိုရင်
ORM / Database / Model ကိုတော့ မှီခိုရမယ်။
တက်နိုင်သမျှ dependency အနည်းဆုံးနဲ့ စည်းမျဉ်းစည်းကမ်းတွေ အသေသပ်ဆုံး ရေးထားတဲ့ နေရာက Service ပဲဖြစ်မယ်။

Model
ရှင်းပါတယ်။ Core Entity နဲ့ ORM ကို ဆက်သွယ်ပေးတဲ့ အပိုင်း။



--

Let's import regions and township
it's kind of seeder
but we prefer manual import :D




