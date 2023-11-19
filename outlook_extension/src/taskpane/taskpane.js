/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";

    const item = Office.context.mailbox.item;
    document.getElementById("sender-box").innerHTML = item.sender.displayName;
    document.getElementById("domain-box").innerHTML = "@" + item.sender.emailAddress.split("@")[1];
    item.body.getAsync(Office.CoercionType.Text, function (result) {
      let body = result.value;
    });
  }
});
