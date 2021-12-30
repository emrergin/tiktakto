# tiktakto
[Tic-Tac-Toe](https://en.wikipedia.org/wiki/Tic-tac-toe) for [The Odin Project](https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/tic-tac-toe)

This is mainly an exercise for **Factory Functions** and the **Module Pattern**. While I think I got the latter, the project did not need that many objects.

I also implemented my first AI, ever.

However, the solution I personally found was not using any implementation of [minimax algorithm](https://en.wikipedia.org/wiki/Minimax), meaning the AI was not able to see *k* steps ahead, and could only do local calculations to use some heuristic. While it was not bad, it was not perfect, hence I tried to understand the minimax algorithm. During my research, I discovered the great website, [Geeks for Geeks](https://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/) that includes a fully working code, albeit with some not so best practices. This did not feel like reinventing the wheel, more of a learning opportunity. And yes, I learned a lot!

### What I learned:
- Heuristics is not enough even for solution of such a simple game.
- Javascript can not natively copy multidimensional arrays. Thanks [Brian](https://www.linkedin.com/in/brianbucklew)!
- For a recursive function, using literal values like strings as parameters is a much better solution.
- The number zero is a falsy expression as much as undefined is, so for functions possibly returning zeros, just getting a return does not ensure its truth value.
- The difference between `position:absolute` and `position:fixed`.