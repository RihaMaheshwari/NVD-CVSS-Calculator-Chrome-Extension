(function () {
    'use strict';
    /**
     * Factory used to provide the tooltip data for CVSS
     */
    angular.module('nvdApp.cvssV3').factory('TooltipFactory', function () {
        var service = {};       // service object: things in here will be accessible to the client

        // Base tooltips defined here
        var tooltipBase = {
            // ==================
            // BASE Metrics Group
            // ==================
            "l_bsm" : "The Base metric group represents the intrinsic characteristics of a " +
            "vulnerability that are constant over time and across user environments. It is composed " +
            "of two sets of metrics: the Exploitability metrics and the Impact metrics. The " +
            "Exploitability metrics reflect the ease and technical means by which the vulnerability " +
            "can be exploited. That is, they represent characteristics of the thing that is " +
            "vulnerable, which we refer to formally as the vulnerable component. On the other hand, " +
            "the Impact metrics reflect the direct consequence of a successful exploit, and represent " +
            "the consequence to the thing that suffers the impact, which we refer to formally as the " +
            "impacted component.",
            "l_av" : "This metric reflects the context by which vulnerability exploitation is possible. " +
            "This metric value (and consequently the Base score) will be larger the more remote " +
            "(logically, and physically) an attacker can be in order to exploit the vulnerable " +
            "component.",
            // Attack Vector Buttons
            "b_avn" : "A vulnerability exploitable with Network access means the vulnerable component is " +
            "bound to the network stack and the attacker's path is through OSI layer 3 (the network " +
            "layer). Such a vulnerability is often termed 'remotely exploitable' and can be thought " +
            "of as an attack being exploitable one or more network hops away (e.g. across layer 3 " +
            "boundaries from routers).",
            "b_ava" : "A vulnerability exploitable with Adjacent Network access means the vulnerable " +
            "component is bound to the network stack, however the attack is limited to the same " +
            "shared physical (e.g. Bluetooth, IEEE 802.11), or logical (e.g. local IP subnet) " +
            "network, and cannot be performed across an OSI layer 3 boundary (e.g. a router).",
            "b_avl" : "A vulnerability exploitable with Local access means that the vulnerable component " +
            "is not bound to the network stack, and the attacker's path is via read/write/execute " +
            "capabilities. In some cases, the attacker may be logged in locally in order to exploit " +
            "the vulnerability, or may rely on User Interaction to execute a malicious file.",
            "b_avp" : "A vulnerability exploitable with Physical access requires the attacker to " +
            "physically touch or manipulate the vulnerable component, such as attaching an peripheral " +
            "device to a system.",
            // Access Complexity
            "l_ac" : "The Attack Complexity metric describes the conditions beyond the attacker's " +
            "control that must exist in order to exploit the vulnerability. As described below, such " +
            "conditions may require the collection of more information about the target, the presence " +
            "of certain system configuration settings, or computational exceptions.",
            "b_acl" : "Specialized access conditions or extenuating circumstances do not exist. An " +
            "attacker can expect repeatable success against the vulnerable component.",
            "b_ach" : "A successful attack depends on conditions beyond the attacker's control. That is, " +
            "a successful attack cannot be accomplished at will, but requires the attacker to invest " +
            "in some measurable amount of effort in preparation or execution against the vulnerable " +
            "component before a successful attack can be expected.",
            // Privileges Required
            "l_pr" : "This metric describes the level of privileges an attacker must possess before " +
            "successfully exploiting the vulnerability.",
            "b_prn" : "The attacker is unauthorized prior to attack, and therefore does not require any " +
            "access to settings or files to carry out an attack.",
            "b_prl" : "The attacker is authorized with (i.e. requires) privileges that provide basic " +
            "user capabilities that could normally affect only settings and files owned by a user. " +
            "Alternatively, an attacker with Low privileges may have the ability to cause an impact " +
            "only to non-sensitive resources.",
            "b_prh" : "The attacker is authorized with (i.e. requires) privileges that provide " +
            "significant (e.g. administrative) control over the vulnerable component that could " +
            "affect component-wide settings and files.",
            // User Interaction
            "l_ui" : "This metric captures the requirement for a user, other than the attacker, to " +
            "participate in the successful compromise of the vulnerable component. This metric " +
            "determines whether the vulnerability can be exploited solely at the will of the " +
            "attacker, or whether a separate user (or user-initiated process) must participate in " +
            "some manner.",
            "b_uin" : "The vulnerable system can be exploited without interaction from any user.",
            "b_uir" : "Successful exploitation of this vulnerability requires a user to take some action " +
            "before the vulnerability can be exploited, such as convincing a user to click a link in " +
            "an email.",
            // Scope
            "l_scp" : "An important property captured by CVSS v3.0 is the ability for a vulnerability in " +
            "one software component to impact resources beyond its means, or privileges. This " +
            "consequence is represented by the metric Authorization Scope, or simply Scope.  For more " +
            "information see the CVSSv3 Specification " +
            "(https://www.first.org/cvss/specification-document#i2.2).",
            "b_scpu" : "An exploited vulnerability can only affect resources managed by the same " +
            "authority. In this case the vulnerable component and the impacted component are the " +
            "same.",
            "b_scpc" : "An exploited vulnerability can affect resources beyond the authorization " +
            "privileges intended by the vulnerable component. In this case the vulnerable component " +
            "and the impacted component are different.",
            // Impact Metrics, Confidentiality Impact
            "l_ci" : "This metric measures the impact to the confidentiality of the information " +
            "resources managed by a software component due to a successfully exploited vulnerability. " +
            "Confidentiality refers to limiting information access and disclosure to only authorized " +
            "users, as well as preventing access by, or disclosure to, unauthorized ones.",
            "b_cin" : "There is no loss of confidentiality within the impacted component.",
            "b_cil" : "There is some loss of confidentiality. Access to some restricted information is " +
            "obtained, but the attacker does not have control over what information is obtained, or " +
            "the amount or kind of loss is constrained. The information disclosure does not cause a " +
            "direct, serious loss to the impacted component.",
            "b_cih" : "There is total loss of confidentiality, resulting in all resources within the " +
            "impacted component being divulged to the attacker. Alternatively, access to only some " +
            "restricted information is obtained, but the disclosed information presents a direct, " +
            "serious impact.",
            // Integrity Impact
            "l_ii" : "This metric measures the impact to integrity of a successfully exploited " +
            "vulnerability. Integrity refers to the trustworthiness and veracity of information.",
            "b_iin" : "There is no loss of integrity within the impacted component.",
            "b_iil" : "Modification of data is possible, but the attacker does not have control over the " +
            "consequence of a modification, or the amount of modification is constrained. The data " +
            "modification does not have a direct, serious impact on the impacted component.",
            "b_iih" : "There is a total loss of integrity, or a complete loss of protection. For " +
            "example, the attacker is able to modify any/all files protected by the impacted " +
            "component. Alternatively, only some files can be modified, but malicious modification " +
            "would present a direct, serious consequence to the impacted component.",
            // Availability Impact
            "l_ai" : "This metric measures the impact to the availability of the impacted component " +
            "resulting from a successfully exploited vulnerability. While the Confidentiality and " +
            "Integrity impact metrics apply to the loss of confidentiality or integrity of data " +
            "(e.g., information, files) used by the impacted component, this metric refers to the " +
            "loss of availability of the impacted component itself, such as a networked service " +
            "(e.g., web, database, email). Since availability refers to the accessibility of " +
            "information resources, attacks that consume network bandwidth, processor cycles, or disk " +
            "space all impact the availability of an impacted component.",
            "b_ain" : "There is no impact to availability within the impacted component.",
            "b_ail" : "There is reduced performance or interruptions in resource availability. Even if " +
            "repeated exploitation of the vulnerability is possible, the attacker does not have the " +
            "ability to completely deny service to legitimate users. The resources in the impacted " +
            "component are either partially available all of the time, or fully available only some " +
            "of the time, but overall there is no direct, serious consequence to the impacted " +
            "component.",
            "b_aih" : "There is total loss of availability, resulting in the attacker being able to " +
            "fully deny access to resources in the impacted component; this loss is either sustained " +
            "(while the attacker continues to deliver the attack) or persistent (the condition " +
            "persists even after the attack has completed). Alternatively, the attacker has the " +
            "ability to deny some availability, but the loss of availability presents a direct, " +
            "serious consequence to the impacted component (e.g., the attacker cannot disrupt " +
            "existing connections, but can prevent new connections; the attacker can repeatedly " +
            "exploit a vulnerability that, in each instance of a successful attack, leaks a only " +
            "small amount of memory, but after repeated exploitation causes a service to become " +
            "completely unavailable)."
        };

        // Temporal tooltips defined here
        var tooltipTemp = {
            // ======================
            // Temporal Metrics Group
            // ======================
            "l_tsm" : "The Temporal metrics measure the current state of exploit techniques or code " +
            "availability, the existence of any patches or workarounds, or the confidence that one " +
            "has in the description of a vulnerability. Temporal metrics will almost certainly change " +
            "over time.",
            // Exploitability
            "l_exp" : "This metric measures the likelihood of the vulnerability being attacked, and is " +
            "typically based on the current state of exploit techniques, exploit code availability, " +
            "or active, 'in-the-wild' exploitation. The more easily a vulnerability can be exploited, " +
            "the higher the vulnerability score.",
            "b_ex" : "Assigning this value to the metric will not influence the score. It is a signal to " +
            "a scoring equation to skip this metric.",
            "b_eu" : "No exploit code is available, or an exploit is entirely theoretical.",
            "b_ep" : "Proof-of-concept exploit code is available, or an attack demonstration is not " +
            "practical for most systems. The code or technique is not functional in all situations " +
            "and may require substantial modification by a skilled attacker.",
            "b_ef" : "Functional exploit code is available. The code works in most situations where the " +
            "vulnerability exists.",
            "b_eh" : "Functional autonomous code exists, or no exploit is required (manual trigger) " +
            "and details are widely available. Exploit code works in every situation, or is actively " +
            "being delivered via an autonomous agent (such as a worm or virus). Network-connected " +
            "systems are likely to encounter scanning or exploitation attempts. Exploit development " +
            "has reached the level of reliable, widely-available, easy-to-use automated tools.",
            // Remediation Level
            "l_rl" : "The Remediation Level of a vulnerability is an important factor for " +
            "prioritization. The typical vulnerability is unpatched when initially published. " +
            "Workarounds or hotfixes may offer interim remediation until an official patch or upgrade " +
            "is issued. Each of these respective stages adjusts the temporal score downwards, " +
            "reflecting the decreasing urgency as remediation becomes final.",
            "b_rlx" : "Assigning this value to the metric will not influence the score. It is a signal " +
            "to a scoring equation to skip this metric.",
            "b_rlo" : "A complete vendor solution is available. Either the vendor has issued an official " +
            "patch, or an upgrade is available.",
            "b_rlt" : "There is an official but temporary fix available. This includes instances where " +
            "the vendor issues a temporary hotfix, tool, or workaround.",
            "b_rlw" : "There is an unofficial, non-vendor solution available. In some cases, users of " +
            "the affected technology will create a patch of their own or provide steps to work around " +
            "or otherwise mitigate the vulnerability.",
            "b_rlu" : "There is either no solution available or it is impossible to apply.",
            // Report Confidence
            "l_rc" : "This metric measures the degree of confidence in the existence of the " +
            "vulnerability and the credibility of the known technical details. Sometimes only the " +
            "existence of vulnerabilities are publicized, but without specific details. The " +
            "vulnerability may later be corroborated by research which suggests where the " +
            "vulnerability may lie, though the research may not be certain. Finally, a vulnerability " +
            "may be confirmed through acknowledgement by the author or vendor of the affected " +
            "technology.",
            "b_rcx" : "Assigning this value to the metric will not influence the score. It is a signal " +
            "to the equation to skip this metric.",
            "b_rcu" : "There are reports of impacts that indicate a vulnerability is present. The " +
            "reports indicate that the cause of the vulnerability is unknown, or reports may differ " +
            "on the cause or impacts of the vulnerability. Reporters are uncertain of the true nature " +
            "of the vulnerability, and there is little confidence in the validity of the reports or " +
            "whether a static Base score can be applied given the differences described.",
            "b_rcr" : "Significant details are published, but researchers either do not have full " +
            "confidence in the root cause, or do not have access to source code to fully confirm all " +
            "of the interactions that may lead to the result. Reasonable confidence exists, however, " +
            "that the bug is reproducible and at least one impact is able to be verified (proof-of- " +
            "concept exploits may provide this).",
            "b_rcc" : "Detailed reports exist, or functional reproduction is possible (functional " +
            "exploits may provide this). Source code is available to independently verify the " +
            "assertions of the research, or the author or vendor of the affected code has confirmed " +
            "the presence of the vulnerability."
        };

        // Environmental tooltips defined here
        var tooltipEnv = {
            // ======================
            // Environmental Metrics Group
            // ======================
            "l_esm" : "These metrics enable the analyst to customize the CVSS score depending on the " +
            "importance of the affected IT asset to a user's organization, measured in terms of " +
            "complementary/alternative security controls in place, Confidentiality, Integrity, and " +
            "Availability. The metrics are the modified equivalent of base metrics and are assigned " +
            "metrics value based on the component placement in organization infrastructure.",
            // Modified Attack Vector
            "l_mav":
                "Used to modify the base attack vector settings.",
            "b_mavx":
                "Modified Attack Vector not defined.",
            "b_mavl":
                "Modified: " + tooltipBase.b_avl,
            "b_mava":
                "Modified: " + tooltipBase.b_ava,
            "b_mavn":
                "Modified: " + tooltipBase.b_avn,
            "b_mavp":
                "Modified: " + tooltipBase.b_avp,
            // Modified Access Complexity
            "l_mac":
                "Used to modify the base access complexity settings.",
            "b_macx":
                "Modified Access Complexity not defined.",
            "b_macl":
                "Modified: " + tooltipBase.b_acl,
            "b_mach":
                "Modified: " + tooltipBase.b_ach,
            // Modified Privileges Required
            "l_mpr":
                "Used to modify the base privileges required settings.",
            "b_mprx":
                "Modified Privileges Required not defined.",
            "b_mprn":
                "Modified: " + tooltipBase.b_prn,
            "b_mprl":
                "Modified: " + tooltipBase.b_prl,
            "b_mprh":
                "Modified: " + tooltipBase.b_prh,
            // Modified User Interaction
            "l_mui":
                "Used to modify the base user interaction settings.",
            "b_muix":
                "Modified User Interaction not defined.",
            "b_muin":
                "Modified: " + tooltipBase.b_uin,
            "b_muir":
                "Modified: " + tooltipBase.b_uir,
            // Scope
            "l_mscp":
                "Used to modify the base scope settings.",
            "b_mscpx":
                "Modified Scope not defined.",
            "b_mscpu":
                "Modified: " + tooltipBase.b_scpu,
            "b_mscpc":
                "Modified: " + tooltipBase.b_scpc,
            // Confidentiality Impact
            "l_mci":
                "Used to modify the base confidentiality requirement settings.",
            "b_mcix":
                "Modified Confidentiality Impact not defined.",
            "b_mcin":
                "Modified: " + tooltipBase.b_cin,
            "b_mcil":
                "Modified: " + tooltipBase.b_cil,
            "b_mcih":
                "Modified: " + tooltipBase.b_cih,
            // Integrity Impact
            "l_mii":
                "Used to modify the base integrity impact settings.",
            "b_miix":
                "Modified Integrity Impact not defined.",
            "b_miin":
                "Modified: " + tooltipBase.b_iin,
            "b_miil":
                "Modified: " + tooltipBase.b_iil,
            "b_miih":
                "Modified: " + tooltipBase.b_iih,
            // Availability Impact
            "l_mai":
                "Used to modify the base availability impact settings.",
            "b_maix":
                "Modified Availability Impact not defined.",
            "b_main":
                "Modified: " + tooltipBase.b_ain,
            "b_mail":
                "Modified: " + tooltipBase.b_ail,
            "b_maih":
                "Modified: " + tooltipBase.b_aih,
            // Confidentiality Requirement
            "l_ecr":
                "",     // tooltip not required
            "b_ecrx":
                "Assigning this value to the metric will not influence the score. It is a signal to the equation to skip this metric.",
            "b_ecrl":
                "Loss of Confidentiality is likely to have only a limited adverse effect on the organization or " +
                "individuals associated with the organization (e.g., employees, customers).",
            "b_ecrm":
                "Loss of Confidentiality is likely to have a serious adverse effect on the organization or " +
                "individuals associated with the organization (e.g., employees, customers).",
            "b_ecrh":
                "Loss of Confidentiality is likely to have a catastrophic adverse effect on the organization or " +
                "individuals associated with the organization (e.g., employees, customers).",
            // Integrity Requirement
            "l_eir":
                "",     // tooltip not required
            "b_eirx":
                "Assigning this value to the metric will not influence the score. It is a signal to the equation to skip this metric.",
            "b_eirl":
                "Loss of Integrity is likely to have only a limited adverse effect on the organization or " +
                "individuals associated with the organization (e.g., employees, customers).",
            "b_eirm":
                "Loss of Integrity is likely to have a serious adverse effect on the organization or " +
                "individuals associated with the organization (e.g., employees, customers).",
            "b_eirh":
                "Loss of Integrity is likely to have a catastrophic adverse effect on the organization or " +
                "individuals associated with the organization (e.g., employees, customers).",
            // Availability Requirement
            "l_ear":
                "",     // tooltip not required
            "b_earx":
                "Assigning this value to the metric will not influence the score. It is a signal to the equation to skip this metric.",
            "b_earl":
                "Loss of availability is likely to have only a limited adverse effect on the organization or " +
                "individuals associated with the organization (e.g., employees, customers).",
            "b_earm":
                "Loss of availability is likely to have a serious adverse effect on the organization or " +
                "individuals associated with the organization (e.g., employees, customers).",
            "b_earh":
                "Loss of availability is likely to have a catastrophic adverse effect on the organization or " +
                "individuals associated with the organization (e.g., employees, customers)."
        };

        // Total will contain ALL the tooltips from the 3 structures above
        var total = {};

        // get Base tooltips and add to total
        var props = Object.keys(tooltipBase);
        for (var i = 0; i < props.length; ++i) {
            total[props[i]] = tooltipBase[props[i]];
        }
        // get temporal tooltips and add to total
        props = Object.keys(tooltipTemp);
        for (i = 0; i < props.length; ++i) {
            total[props[i]] = tooltipTemp[props[i]];
        }
        // get environmental tooltips and add to total
        props = Object.keys(tooltipEnv);
        for (i = 0; i < props.length; ++i) {
            total[props[i]] = tooltipEnv[props[i]];
        }

        // make Total accessible to client by adding to service object
        service.tooltipData = total;
        return service;
    });
})();
