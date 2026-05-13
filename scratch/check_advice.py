import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.abspath('backend'))

try:
    from main import CLASS_NAMES, ADVICE_MAP
    
    print(f"Number of classes: {len(CLASS_NAMES)}")
    print(f"Number of advice entries: {len(ADVICE_MAP)}")
    
    missing = []
    for name in CLASS_NAMES:
        if name not in ADVICE_MAP:
            missing.append(name)
            
    if missing:
        print("Missing advice for classes:")
        for m in missing:
            print(f"- {m}")
    else:
        print("All classes have advice entries.")
        
    # Check for extra keys in ADVICE_MAP that are not in CLASS_NAMES (potential typos)
    extra = []
    for name in ADVICE_MAP:
        if name not in CLASS_NAMES:
            extra.append(name)
            
    if extra:
        print("\nAdvice entries with no matching class (possible typos):")
        for e in extra:
            print(f"- {e}")
            
except Exception as e:
    print(f"Error: {e}")
