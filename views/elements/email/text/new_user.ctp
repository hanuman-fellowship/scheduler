Hello <?=$username?>,

You have a new account on the Scheduler!

To log in, please go to <?= 'http://'.$_SERVER['HTTP_HOST'].'/scheduler' ?> and click "Login" at the upper right.
Your username is <?=strtolower($username)?> (not case sensitive)
Your new temporary password is: <?=$password?> (case sensitive)

You can change your password after you log in.

This is an automated response, so please do not reply to this email.
You are welcome to contact operations at <?=$operationsEmail?> with any questions.

Automatically Yours,
The Scheduler
