from transformers import pipeline
import sys

def main(user_input):
    try:
        pipe = pipeline("text2text-generation", model="facebook/blenderbot-400M-distill")


        response = pipe(user_input, max_length=100, num_return_sequences=1)[0]["generated_text"]
        print(response)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No input Provided", file= sys.stderr)
        sys.exit(1)

    main(sys.argv[1])