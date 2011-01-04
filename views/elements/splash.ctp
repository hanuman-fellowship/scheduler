<style>
.style1 {
	font-family: Georgia, "Times New Roman", Times, serif;
	font-size: 36px;
	color: #2F2818;
	padding: 30px;
	background-color: #dfdbc3;
	border: medium solid #666666;
}
.style2 {
	color: #333;
	font-size: 16px;
}
.style3 {
	font-size: 10px;
	color: #000033;
	font-family: "Times New Roman", Times, serif;
}
a {
	text-decoration:none;
}
</style>

<body>
<table width="100%" border="0" cellspacing="0" cellpadding="0">
  <tr>
    <td><p>&nbsp;</p>
      <table width="400" border="0" align="center" cellpadding="0" cellspacing="0">
      <tr>
        <td>
				<?=$ajax->link('
					<div align="center" class="style1">
						<p>SCHEDULER</p>
						<p><span class="style2">version 2.0b </span></p>
						<p class="style3">&copy; 2011 Hanuman Fellowship | All Rights Reserved<br />
						</p>
					</div>',
					array('controller'=>'people','action'=>'schedule'),
					array(
						'update'=>'dialog_content',
						'escape'=>false,
						'complete'=>"openDialog('menu_People',true,'bottom')"
					))?>
				</td>
      </tr>
    </table></td>
  </tr>
</table>
	
	
	
	
	
</body>
</html>
