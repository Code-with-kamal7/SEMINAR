#!/usr/bin/env python3

import os
import sys
import time
import shutil
import textwrap

# ================= TERMINAL COLORS =================

R = "\033[91m"       # Red
G = "\033[92m"       # Green
Y = "\033[93m"       # Yellow
B = "\033[94m"       # Blue
C = "\033[96m"       # Cyan
W = "\033[97m"       # White
M = "\033[95m"       # Magenta
RESET = "\033[0m"
BOLD = "\033[1m"

WIDTH = min(max(shutil.get_terminal_size((90, 25)).columns, 60), 100)


# ================= TERMINAL FUNCTIONS =================

def clear():
    os.system("cls" if os.name == "nt" else "clear")


def line(char="=", color=C):
    print(color + char * WIDTH + RESET)


def center(text, color=G):
    print(color + text.center(WIDTH) + RESET)


def pause():
    input(f"\n{G}[ENTER] Return to main menu...{RESET}")


def type_text(text, color=G, delay=0.008):
    sys.stdout.write(color)
    for char in text:
        sys.stdout.write(char)
        sys.stdout.flush()
        if delay:
            time.sleep(delay)
    print(RESET)


def box_title(title):
    print(f"\n{C}{BOLD}+{'-' * (WIDTH - 2)}+{RESET}")
    print(f"{C}|{RESET}{title.center(WIDTH - 2)}{C}|{RESET}")
    print(f"{C}+{'-' * (WIDTH - 2)}+{RESET}")


# ================= MAIN BANNER =================

def banner():
    clear()

    print()
    center(" _____ __  __    _    ___ _       ____  ____   ___  ___", R)
    center("| ____|  \\/  |  / \\  |_ _| |     / ___||  _ \\ / _ \\|_ _|", R)
    center("|  _| | |\\/| | / _ \\  | || |     \\___ \\| |_) | | | || |", R)
    center("| |___| |  | |/ ___ \\ | || |___   ___) |  __/| |_| || |", G)
    center("|_____|_|  |_/_/   \\_\\___|_____| |____/|_|    \\___/|___|", G)

    print()
    center("E M A I L   S P O O F I N G", R)
    center("S I M U L A T O R", G)
    center("C Y B E R S E C U R I T Y   S E M I N A R", B)

    line("=", C)

    print(f"{R}{BOLD}[!] WARNING: EDUCATIONAL SIMULATION ONLY{RESET}")
    print(f"{W}    No email will be sent to any recipient.{RESET}")
    print(f"{W}    No internet or SMTP connection is used.{RESET}")
    print(f"{W}    All authentication results are fictional.{RESET}")

    line("=", C)


# ================= MAIN MENU =================

def menu():
    banner()

    print(f"\n{C}+{'-' * (WIDTH - 2)}+{RESET}")
    print(f"{C}|{BOLD}              [ MAIN CONTROL PANEL ]{RESET}{C}{' ' * max(0, WIDTH - 36)}|{RESET}")
    print(f"{C}+{'-' * (WIDTH - 2)}+{RESET}")

    options = [
        ("01", "Create Simulated Email"),
        ("02", "Demonstrate Sender Identity"),
        ("03", "Explore SPF / DKIM / DMARC"),
        ("04", "Email Security Information"),
        ("05", "Exit Simulator"),
    ]

    for number, title in options:
        print(f"  {G}[{number}]{RESET}  {W}{title}{RESET}")

    line("-", C)

    print(f"\n{G}┌──[{W}student@cybersec{G}]─[{B}~/email-simulator{G}]{RESET}")
    choice = input(f"{G}└──╼ {BOLD}Select option: {RESET}").strip()

    return choice


# ================= EMAIL GENERATOR =================

def ask(label, default):
    value = input(
        f"{C}[?] {W}{label}{RESET} "
        f"{Y}[{default}]{RESET}: "
    ).strip()

    return value if value else default


def create_email():
    box_title("CREATE SIMULATED EMAIL")

    print(f"{Y}Use fictional information for this demonstration.{RESET}")
    print(f"{R}[!] This creates a preview only. Nothing will be sent.{RESET}\n")

    sender_name = ask("Sender display name", "IT Support Demo")
    sender_email = ask("Sender address", "it-support@example.com")
    recipient = ask("Recipient address", "student@example.net")
    subject = ask("Email subject", "Cybersecurity Seminar Demo")

    body = input(f"{C}[?] Message body: {RESET}").strip()

    if not body:
        body = (
            "This is a simulated cybersecurity demonstration. "
            "Always verify unexpected requests independently."
        )

    print()
    line("=", G)
    center("EMAIL PREVIEW // SIMULATED", G)
    line("=", G)

    print(f"{C}FROM:{RESET}    {W}{sender_name} <{sender_email}>{RESET}")
    print(f"{C}TO:{RESET}      {W}{recipient}{RESET}")
    print(f"{C}SUBJECT:{RESET} {W}{subject}{RESET}")

    line("-", C)

    print(f"{W}MESSAGE:{RESET}")

    for paragraph in textwrap.wrap(body, width=WIDTH - 4):
        print("  " + paragraph)

    line("-", C)

    print(f"{G}[STATUS]{RESET} {Y}SIMULATION ONLY — NOT SENT{RESET}")
    print(f"{R}[!] No real email was created or delivered.{RESET}")


# ================= SENDER IDENTITY DEMO =================

def sender_demo():
    box_title("SENDER IDENTITY DEMONSTRATION")

    print(f"\n{Y}Example inbox display:{RESET}\n")

    print(f"{C}DISPLAY NAME:{RESET} {W}College IT Helpdesk{RESET}")
    print(f"{C}EMAIL ADDRESS:{RESET} {M}helpdesk@example.net{RESET}")

    line("-", C)

    print(f"{G}[+] SECURITY ANALYSIS{RESET}\n")

    print("A display name is just text.")
    print("It does not prove the sender's identity.")
    print()
    print("Always check the complete email address.")
    print("Look for suspicious domains and unexpected requests.")
    print("Verify sensitive requests through a trusted channel.")

    line("-", C)

    print(f"{R}[!] Educational example. No email is sent.{RESET}")


# ================= AUTHENTICATION SCENARIOS =================

def authentication_demo():
    box_title("SPF / DKIM / DMARC ANALYSIS")

    print(f"\n{G}[1]{W} All authentication checks pass and align")
    print(f"{G}[2]{W} Authentication checks fail")
    print(f"{G}[3]{W} SPF passes but DMARC alignment fails")
    print(f"{G}[4]{W} DKIM passes and aligns")

    choice = input(f"\n{G}└──╼ Select scenario: {RESET}").strip()

    scenarios = {
        "1": (
            "PASS",
            "PASS",
            "PASS",
            "At least one aligned authentication method passes."
        ),
        "2": (
            "FAIL",
            "FAIL",
            "FAIL",
            "Neither SPF nor DKIM passes with the required alignment."
        ),
        "3": (
            "PASS",
            "FAIL",
            "FAIL",
            "SPF passing alone does not guarantee DMARC passes."
        ),
        "4": (
            "FAIL",
            "PASS",
            "PASS",
            "Aligned DKIM can allow DMARC to pass even when SPF fails."
        ),
    }

    result = scenarios.get(choice)

    if not result:
        print(f"{R}[!] Invalid option.{RESET}")
        return

    spf, dkim, dmarc, lesson = result

    print()
    line("=", C)

    for name, status in [
        ("SPF", spf),
        ("DKIM", dkim),
        ("DMARC", dmarc),
    ]:
        color = G if status == "PASS" else R
        print(f"{C}[{name}]{RESET} {color}{BOLD}{status} (SIMULATED){RESET}")

    line("-", C)

    print(f"{Y}SEMINAR TAKEAWAY:{RESET}")
    print(textwrap.fill(lesson, width=WIDTH))

    print()
    print(f"{R}[!] These are fictional results, not live security checks.{RESET}")


# ================= SECURITY INFORMATION =================

def security_info():
    box_title("EMAIL SECURITY BRIEFING")

    print(f"\n{G}[SPF]{RESET}")
    print("Checks whether a sending server is authorized by a domain's SPF policy.")

    print(f"\n{G}[DKIM]{RESET}")
    print("Uses a cryptographic signature to help verify message integrity.")

    print(f"\n{G}[DMARC]{RESET}")
    print("Checks alignment with the visible From domain and specifies")
    print("how receivers should handle authentication failures.")

    line("-", C)

    print(f"\n{Y}[IMPORTANT]{RESET}")
    print("This simulator does not query DNS.")
    print("It does not inspect real email headers.")
    print("It does not verify cryptographic signatures.")
    print("All authentication results are illustrative.")

    line("-", C)

    print(f"{G}Better awareness = safer internet.{RESET}")


# ================= MAIN PROGRAM =================

def main():
    while True:

        choice = menu()

        if choice == "1" or choice == "01":
            create_email()
            pause()

        elif choice == "2" or choice == "02":
            sender_demo()
            pause()

        elif choice == "3" or choice == "03":
            authentication_demo()
            pause()

        elif choice == "4" or choice == "04":
            security_info()
            pause()

        elif choice == "5" or choice == "05":
            clear()
            line("=", G)
            center("SIMULATOR TERMINATED", R)
            center("NO EMAIL WAS SENT", Y)
            center("BETTER AWARENESS = SAFER INTERNET", G)
            line("=", G)
            break

        else:
            print(f"{R}[!] Invalid selection. Choose 01-05.{RESET}")
            time.sleep(1)


if __name__ == "__main__":
    try:
        main()

    except (KeyboardInterrupt, EOFError):
        print(f"\n\n{Y}[!] Simulator closed safely. No email was sent.{RESET}")